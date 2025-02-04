require("dotenv").config();
const express = require("express");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebaseConfig.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate JWT Token
const generateToken = (uid) => {
  return jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRecord = await admin.auth().createUser({ email, password });
    const token = generateToken(userRecord.uid);
    res.json({ token, uid: userRecord.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await admin.auth().getUserByEmail(email);
    const token = generateToken(user.uid);
    res.json({ token, uid: user.uid });
  } catch (error) {
    res.status(400).json({ error: "Invalid credentials" });
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });
    req.uid = decoded.uid;
    next();
  });
};

// Generate AI-Powered Lessons
app.post("/lessons", verifyToken, async (req, res) => {
  try {
    const { subject, topic, difficulty } = req.body;
    const prompt = `Create a study material for ${subject}, topic: ${topic}, difficulty level: ${difficulty}.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
    });

    const lesson = response.choices[0].message.content;
    await db.collection("lessons").add({ uid: req.uid, subject, topic, lesson });

    res.json({ lesson });
  } catch (error) {
    res.status(500).json({ error: "AI lesson generation failed" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
