import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt.js";
import passport from "passport";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Registration controller
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, provider: "local" },
        });
        // Return user and token
        res.status(201).json({ user, token: generateToken(user) });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Something went wrong during registration" });
    }
};

// Login controller
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        // Check if password is correct
        const validPassword = bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        // Return user and token
        res.json({ user, token: generateToken(user) });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Something went wrong during login" });
    }
};

// Google OAuth controller
export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

// Google OAuth callback controller
export const googleAuthCallback = async (req, res) => {
    // Google OAuth callback logic
    const token = jwt.sign({ id: req.user.id }, JWT_SECRET, { expiresIn: "1hr" });
    res.json({ user: req.user, token });
};
