import { PrismaClient } from "@prisma/client";
import plaidClient from "../config/plaid.js";

const prisma = new PrismaClient();
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID || "";
const PLAID_SECRET = process.env.PLAID_SECRET || "";

// Create transaction
export const createTransaction = async (req, res) => {
  try {
    const { userId, amount, type, category, date, description, source } = req.body;

    const transaction = await prisma.transaction.create({
      data: { userId, amount, type, category, date, description, source },
    });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get transactions
export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.query;
    const transactions = await prisma.transaction.findMany({
      where: { userId: userId },
      orderBy: { date: "desc" },
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// Update transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to update transaction" });
  }
};

// Delete transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.transaction.delete({ where: { id } });

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};


export const getPlaidAccessToken = async (req, res) => {
    try {
      const { public_token } = req.body;

      const response = await plaidClient.itemPublicTokenExchange({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        public_token: public_token,
      });
  
      const accessToken = response.data.access_token;
      res.json({ accessToken });
    } catch (error) {
      res.status(500).json({ error: "Failed to get access token" });
    }
};

export const fetchBankTransactions = async (req, res) => {
    try {
      const { accessToken, startDate, endDate, offset = 0, limit = 100 } = req.body;
  
      const response = await plaidClient.transactionsGet({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        options: {
          offset: offset,
          count: limit,
        },
      });
  
      const transactions = response.data.transactions;
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bank transactions" });
    }
};

