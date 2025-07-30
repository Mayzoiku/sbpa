import { Router } from "express";
import axios from "axios";
import { sanitize } from "../utility.js";
import OpenAI from "openai";

const router = Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/:userId/", async (req, res) => {
  const { userId } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "User message is required" });
  }

  try {
    const statsRes = await axios.get(
      `${process.env.BASE_URL}/wallets/${userId}/stats`
    );

    const stats = statsRes.data.data;

    const systemMessage = `You are a smart financial assistant helping the user understand and improve their finances. Here is the user's recent wallet summary:\n
    - Total Spent this Month: GHS ${stats.totalSpent.currentMonth}\n
    - Total Income this Month: GHS ${stats.totalIncome.currentMonth}\n
    - Net Savings: GHS ${stats.netSavings.currentMonth}\n
    - Top Spending Categories: ${stats.topCategories
      .map((cat) => `${cat.name} (GHS ${cat.currentMonth})`)
      .join(", ")}\n
    Use this data to respond intelligently to the user's questions. No styling, just text only`;

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const sanitizedData = sanitize({
      data: { response: response.choices[0].message.content.trim() },
    });

    res.json(sanitizedData);
  } catch (error) {
    console.error("Chat endpoint error:", error.message);
    res.status(500).json({ message: "Failed to generate AI response" });
  }
});

export default router;
