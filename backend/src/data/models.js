const mongoose = require("mongoose");
const options = { versionKey: false, timestamps: false };

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  options,
);
const accountSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    accountNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ["checking", "savings"], required: true },
    currency: { type: String, required: true, default: "USD" },
    balance: { type: Number, required: true, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["active", "frozen", "closed"],
      required: true,
      default: "active",
    },
    createdAt: { type: Date, required: true },
  },
  options,
);
const transactionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    transferId: { type: String, required: true, index: true },
    accountId: { type: String, required: true, index: true },
    type: { type: String, required: true },
    direction: { type: String, enum: ["credit", "debit"], required: true },
    counterpartyAccountNumber: String,
    amount: { type: Number, required: true, min: 0.01 },
    currency: { type: String, required: true },
    description: String,
    status: { type: String, required: true },
    balanceAfter: { type: Number, required: true },
    createdAt: { type: Date, required: true },
  },
  options,
);
transactionSchema.index({ accountId: 1, createdAt: -1 });

module.exports = {
  User: mongoose.models.User || mongoose.model("User", userSchema),
  Account: mongoose.models.Account || mongoose.model("Account", accountSchema),
  Transaction:
    mongoose.models.Transaction ||
    mongoose.model("Transaction", transactionSchema),
};
