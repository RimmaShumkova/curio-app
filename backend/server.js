require("dotenv").config();
console.log('ENV CHECK:', process.env.MONGODB_URI); // добавь

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");

const app = express();
app.use(cors());
app.use(express.json());

// ─── Google OAuth клиент ──────────────────────────────────────────────────────
const googleClient = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);

// ─── Подключение к MongoDB Atlas ──────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
  })
  .then(() => console.log("✅ MongoDB подключена"))
  .catch((err) => console.error("❌ Ошибка MongoDB:", err));

// ═════════════════════════════════════════════════════════════════════════════
// МОДЕЛИ
// ═════════════════════════════════════════════════════════════════════════════

const userSchema = new mongoose.Schema({
  googleId:  { type: String, required: true, unique: true },
  email:     { type: String, required: true },
  name:      { type: String, required: true },
  picture:   { type: String, default: "" },
  createdAt: { type: Date,   default: Date.now },
});

const User = mongoose.model("User", userSchema);

const childSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name:   { type: String, required: true },
  gender: { type: String, enum: ["boy", "girl", ""], default: "" },
});

const Child = mongoose.model("Child", childSchema);

const progressSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  storyId:      { type: String,  required: true },
  episodeIndex: { type: Number,  default: 0 },
  isCompleted:  { type: Boolean, default: false },
  lastReadAt:   { type: Date,    default: Date.now },
});

progressSchema.index({ userId: 1, storyId: 1 }, { unique: true });

const Progress = mongoose.model("Progress", progressSchema);

// ═════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═════════════════════════════════════════════════════════════════════════════

async function requireAuth(req, res, next) {
  const googleId = req.headers["x-google-id"];
  if (!googleId) {
    return res.status(401).json({ error: "Не авторизован" });
  }

  const user = await User.findOne({ googleId });
  if (!user) {
    return res.status(401).json({ error: "Пользователь не найден" });
  }

  req.user = user;
  next();
}

// ═════════════════════════════════════════════════════════════════════════════
// РОУТЫ — Авторизация
// ═════════════════════════════════════════════════════════════════════════════

app.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Токен не передан" });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: [
        process.env.GOOGLE_ANDROID_CLIENT_ID,
        process.env.GOOGLE_WEB_CLIENT_ID,
      ],
      clockSkew: 3600,
    });

    const payload = ticket.getPayload();

    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email:    payload.email,
        name:     payload.name,
        picture:  payload.picture || "",
      });
      console.log("✅ Новый пользователь:", user.name);
    }

    res.json({ user });

  } catch (err) {
    console.error("Ошибка верификации токена:", err.message);
    res.status(401).json({ error: "Недействительный токен" });
  }
});

// ═════════════════════════════════════════════════════════════════════════════
// РОУТЫ — Профиль ребёнка
// ═════════════════════════════════════════════════════════════════════════════

app.get("/child", requireAuth, async (req, res) => {
  try {
    const child = await Child.findOne({ userId: req.user._id });
    if (!child) {
      return res.status(404).json({ error: "Профиль не найден" });
    }
    res.json({ child });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/child", requireAuth, async (req, res) => {
  const { name, gender } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Имя обязательно" });
  }

  try {
    const child = await Child.findOneAndUpdate(
      { userId: req.user._id },
      { name, gender: gender || "" },
      { returnDocument: "after", upsert: true }
    );
    res.json({ child });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// ═════════════════════════════════════════════════════════════════════════════
// РОУТЫ — Прогресс чтения
// ═════════════════════════════════════════════════════════════════════════════

app.get("/progress", requireAuth, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id });
    res.json({ progress });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.get("/progress/:storyId", requireAuth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId:  req.user._id,
      storyId: req.params.storyId,
    });

    if (!progress) {
      return res.json({
        progress: {
          storyId:      req.params.storyId,
          episodeIndex: 0,
          isCompleted:  false,
          lastReadAt:   null,
        },
      });
    }

    res.json({ progress });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/progress/:storyId", requireAuth, async (req, res) => {
  const { episodeIndex, isCompleted } = req.body;

  try {
    const progress = await Progress.findOneAndUpdate(
      {
        userId:  req.user._id,
        storyId: req.params.storyId,
      },
      {
        episodeIndex: episodeIndex ?? 0,
        isCompleted:  isCompleted  ?? false,
        lastReadAt:   new Date(),
      },
      { returnDocument: "after", upsert: true }
    );

    res.json({ progress });
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// ─── Запуск сервера ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});