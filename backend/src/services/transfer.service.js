const { v4: uuid } = require('uuid');
const repository = require('../data/mongoBankRepository');
const AppError = require('../utils/AppError');

async function transfer(userId, input) {
  const owned = await repository.accounts.findById(input.fromAccountId);
  if (!owned || owned.userId !== userId) throw new AppError('Account not found.', 404, 'ACCOUNT_NOT_FOUND');
  const amount = Number(input.amount);
  const transferId = uuid();
  const now = new Date().toISOString();
  const result = await repository.transfer({ sourceAccountId: owned.id, destinationNumber: input.toAccountNumber, amount, description: input.description || null, transferId, debitId: uuid(), creditId: uuid(), now });
  const failures = {
    SOURCE_NOT_FOUND: ['Account not found.', 404, 'ACCOUNT_NOT_FOUND'], DESTINATION_NOT_FOUND: ['Destination account not found.', 404, 'DESTINATION_NOT_FOUND'],
    SAME_ACCOUNT_TRANSFER: ['Cannot transfer to the same account.', 422, 'SAME_ACCOUNT_TRANSFER'], ACCOUNT_INACTIVE: ['One or more accounts are not active.', 422, 'ACCOUNT_INACTIVE'],
    CURRENCY_MISMATCH: ['Cross-currency transfers are not supported.', 422, 'CURRENCY_MISMATCH'], INSUFFICIENT_FUNDS: ['Insufficient available balance.', 422, 'INSUFFICIENT_FUNDS']
  };
  if (result.failure) throw new AppError(...failures[result.failure]);
  return { transfer: result.transaction, sourceBalance: result.sourceBalance };
}

module.exports = { transfer };
