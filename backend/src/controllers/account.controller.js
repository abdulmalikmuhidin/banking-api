const accountService = require("../services/account.service");
const asyncHandler = require("../utils/asyncHandler");

exports.list = asyncHandler(async (req, res) =>
  res.json({ data: await accountService.listForUser(req.user.id) }),
);
exports.getOne = asyncHandler(async (req, res) =>
  res.json({
    data: await accountService.getOwnedAccount(req.user.id, req.params.id),
  }),
);
exports.transactions = asyncHandler(async (req, res) =>
  res.json({
    data: await accountService.listTransactions(req.user.id, req.params.id),
  }),
);
