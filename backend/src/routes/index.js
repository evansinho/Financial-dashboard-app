import express from 'express';
import passport from "passport";
import { registerUser, loginUser, googleAuth, googleAuthCallback } from '../controllers/authController.js';
import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getPlaidAccessToken,
    fetchBankTransactions
  } from "../controllers/transactionController.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/google", googleAuth);
router.get("/google/callback", passport.authenticate("google", { session: false }), googleAuthCallback);
router.post("/transactions", createTransaction);
router.get("/transactions", getTransactions);
router.put("/transactions/:id", updateTransaction);
router.delete("/transactions/:id", deleteTransaction);
router.post("/plaid/token", getPlaidAccessToken);
router.post("/plaid/transactions", fetchBankTransactions);

export default router;
