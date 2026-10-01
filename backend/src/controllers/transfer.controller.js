const transferService = require('../services/transfer.service');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  const result = await transferService.transfer(req.user.id, req.body);
  res.status(201).json({ data: result });
});
