import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from './routes/index.js';
import passport from "./config/passport.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(passport.initialize());

app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
