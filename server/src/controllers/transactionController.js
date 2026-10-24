import Transaction from '../models/Transaction.js';

// GET /api/transactions
export const getTransactions = async (req, res) => {
  const transactions = await Transaction.find().sort({ createdAt: -1 });
  res.json(transactions);
};
