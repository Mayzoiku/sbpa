import express from "express";
import dotenv from "dotenv";
import walletRouter from "./routes/wallet.js";
import cors from "cors";

// Load environment variables
dotenv.config();

// Port
const port = process.env.APP_PORT;

// Initialize app
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Wallet routes
app.use("/wallets", walletRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
