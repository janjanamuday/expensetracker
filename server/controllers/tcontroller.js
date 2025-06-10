import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

const monthNameToNumber = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export const getTransactions = async (req, res) => {
  try {
    const { month, year } = req.query;


    if (!month || !year) {
      const allTransactions = await Transaction.find();
      return res.status(200).json(allTransactions);
    }

    const monthNumber = monthNameToNumber[month];
    if (!monthNumber) {
      return res.status(400).json({ error: 'Invalid month name' });
    }

    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 1);

    const transactions = await Transaction.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

   
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(txn => {
      if (txn.type === 'income') {
        totalIncome += txn.amount;
      } else if (txn.type === 'expense') {
        totalExpenses += txn.amount;
      }
    });

    const balance = totalIncome - totalExpenses;

    res.status(200).json({
      transactions,
      summary: {
        totalIncome,
        totalExpenses,
        balance,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};




export const addTransaction = async (req, res) => {
  try {
    const { amount, type, category, date,Notes } = req.body;
    const newTransaction = new Transaction({ amount, type, category, date,Notes });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    // 1. Check if ID exists
    if (!req.params.id) {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    // 2. Check if ID is valid (MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

    // 3. Attempt deletion
    const deleted = await Transaction.findByIdAndDelete(req.params.id);

    // 4. If not found, return 404
    if (!deleted) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // 5. Success response
    res.status(200).json({ deletedId: deleted._id });
  } catch (err) {
    // 6. Log and handle errors
    console.error("Delete transaction error:", err);
    res.status(500).json({ error: "Server error" });
  }
};