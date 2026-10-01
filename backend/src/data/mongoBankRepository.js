const mongoose = require("mongoose");
const { User, Account, Transaction } = require("./models");

function normalize(document) {
  if (!document) return undefined;

  const value = document.toObject ? document.toObject() : document;
  const { _id, ...rest } = value;

  return { id: _id, ...rest };
}

const users = {
  async create(user) {
    return normalize(
      await User.create({
        ...user,
        _id: user.id,
      }),
    );
  },

  async findByEmail(email) {
    return normalize(await User.findOne({ email }).lean());
  },

  async findById(id) {
    return normalize(await User.findById(id).lean());
  },
};

const accounts = {
  async create(account) {
    return normalize(
      await Account.create({
        ...account,
        _id: account.id,
      }),
    );
  },

  async findById(id) {
    return normalize(await Account.findById(id).lean());
  },

  async findByUserId(userId) {
    return (await Account.find({ userId }).sort({ createdAt: 1 }).lean()).map(
      normalize,
    );
  },
};

const transactions = {
  async findByAccountId(accountId) {
    return (
      await Transaction.find({ accountId }).sort({ createdAt: -1 }).lean()
    ).map(normalize);
  },
};

async function transfer({
  sourceAccountId,
  destinationNumber,
  amount,
  description,
  transferId,
  debitId,
  creditId,
  now,
}) {
  const session = await mongoose.startSession();

  let outcome;

  try {
    await session.withTransaction(async () => {
      const [source, destination] = await Promise.all([
        Account.findById(sourceAccountId).session(session),
        Account.findOne({
          accountNumber: destinationNumber,
        }).session(session),
      ]);

      if (!source) {
        outcome = {
          failure: "SOURCE_NOT_FOUND",
        };
        return;
      }

      if (!destination) {
        outcome = {
          failure: "DESTINATION_NOT_FOUND",
        };
        return;
      }

      if (source.id === destination.id) {
        outcome = {
          failure: "SAME_ACCOUNT_TRANSFER",
        };
        return;
      }

      if (source.status !== "active" || destination.status !== "active") {
        outcome = {
          failure: "ACCOUNT_INACTIVE",
        };
        return;
      }

      if (source.currency !== destination.currency) {
        outcome = {
          failure: "CURRENCY_MISMATCH",
        };
        return;
      }

      if (source.balance < amount) {
        outcome = {
          failure: "INSUFFICIENT_FUNDS",
        };
        return;
      }

      // Calculate the new balances
      source.balance = Number((source.balance - amount).toFixed(2));

      destination.balance = Number((destination.balance + amount).toFixed(2));

      // Save both account changes inside the transaction
      await Promise.all([
        source.save({ session }),
        destination.save({ session }),
      ]);

      const common = {
        transferId,
        amount,
        currency: source.currency,
        description,
        status: "completed",
        createdAt: new Date(now),
      };

      // Create both transaction records.
      // ordered: true is required when using create()
      // with multiple documents and a session.
      await Transaction.create(
        [
          {
            _id: debitId,
            accountId: source.id,
            type: "transfer_debit",
            direction: "debit",
            counterpartyAccountNumber: destination.accountNumber,
            balanceAfter: source.balance,
            ...common,
          },
          {
            _id: creditId,
            accountId: destination.id,
            type: "transfer_credit",
            direction: "credit",
            counterpartyAccountNumber: source.accountNumber,
            balanceAfter: destination.balance,
            ...common,
          },
        ],
        {
          session,
          ordered: true,
        },
      );

      outcome = {
        sourceBalance: source.balance,

        transaction: {
          id: debitId,
          accountId: source.id,
          type: "transfer_debit",
          direction: "debit",
          counterpartyAccountNumber: destination.accountNumber,
          balanceAfter: source.balance,
          ...common,
        },
      };
    });

    return outcome;
  } finally {
    await session.endSession();
  }
}

module.exports = {
  users,
  accounts,
  transactions,
  transfer,
};
