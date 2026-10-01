const repository = require('../data/mongoBankRepository');
const AppError = require('../utils/AppError');

async function listForUser(userId) {
  return repository.accounts.findByUserId(userId);
}

async function getOwnedAccount(userId, accountId) {
  const account = await repository.accounts.findById(accountId);
  if (!account || account.userId !== userId) throw new AppError('Account not found.', 404, 'ACCOUNT_NOT_FOUND');
  return account;
}

async function listTransactions(userId, accountId) {
  await getOwnedAccount(userId, accountId);
  return repository.transactions.findByAccountId(accountId);
}

module.exports = { listForUser, getOwnedAccount, listTransactions };
