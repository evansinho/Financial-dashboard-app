import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create transaction
export const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, description, source } = req.body;
    const userId = req.user.id;

    // Validate and format the date
    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format. Expected ISO-8601 DateTime." });
    }

    const transaction = await prisma.transaction.create({
      data: { userId, amount, type, category, date: formattedDate.toISOString(), description, source },
    });

    res.json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
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

// Get transactions created by the logged-in user
export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    res.status(500).json({ error: "Failed to fetch user transactions" });
  }
};

// Update transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate and format the date if it exists in the update data
    if (updateData.date) {
      const parsedDate = new Date(updateData.date);
      if (isNaN(parsedDate.getTime())) {
        // Attempt to parse non-ISO formats (e.g., MM/DD/YYYY)
        const [month, day, year] = updateData.date.split('/');
        if (month && day && year) {
          const reformattedDate = new Date(`${year}-${month}-${day}`);
          if (!isNaN(reformattedDate.getTime())) {
            updateData.date = reformattedDate.toISOString();
          } else {
            return res.status(400).json({
              error: "Invalid value for argument `date`: input contains invalid characters. Expected ISO-8601 DateTime.",
              received: updateData.date,
            });
          }
        } else {
          return res.status(400).json({
            error: "Invalid value for argument `date`: input contains invalid characters. Expected ISO-8601 DateTime.",
            received: updateData.date,
          });
        }
      } else {
        updateData.date = parsedDate.toISOString();
      }
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
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
