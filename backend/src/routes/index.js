import express from 'express';
import passport from "passport";
import { registerUser, loginUser, googleAuth, googleAuthCallback } from '../controllers/authController.js';
import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getUserTransactions
} from "../controllers/transactionController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/google", googleAuth);
router.get("/google/callback", passport.authenticate("google", { session: false }), googleAuthCallback);

// Protect routes with authentication middleware
router.post("/transactions", authenticate, createTransaction);
router.get("/transactions", authenticate, getTransactions);
router.put("/transactions/:id", authenticate, updateTransaction);
router.delete("/transactions/:id", authenticate, deleteTransaction);
router.get("/transactions/user", authenticate, getUserTransactions);

export default router;
