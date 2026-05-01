const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/curio", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ MongoDB error:", err));

// ========== СХЕМЫ ==========

// Схема эпизода
const episodeSchema = new mongoose.Schema({
  id: Number,
  text: String,
  imageUrl: String
});

// Схема истории
const storySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  coverImage: String,
  episodes: [episodeSchema]
});

// Схема пользователя
const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  email: String,
  name: String,
  picture: String,
  childName: String,
  childGender: String,
  completedStories: [String], // ID историй, которые прочитал
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

// ========== МОДЕЛИ ==========
const Story = mongoose.model("Story", storySchema);
const User = mongoose.model("User", userSchema);

// ========== ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ИСТОРИЙ ==========
async function initializeStories() {
  const count = await Story.countDocuments();
  if (count === 0) {
    const stories = [
      {
        id: "1",
        title: "Друзья собирают ягоды",
        coverImage: "res://berries_kids",
        episodes: [
          { id: 1, text: "Маша и Миша пошли в лес.", imageUrl: "res://forest" },
          { id: 2, text: "Они увидели много ягод.", imageUrl: "res://berries" },
          { id: 3, text: "Дети набрали полные корзинки.", imageUrl: "res://basket" }
        ]
      },
      {
        id: "2",
        title: "Кьюрио в саду",
        coverImage: "res://curio_garden",
        episodes: [
          { id: 1, text: "Кьюрио проснулся утром.", imageUrl: "res://forest" },
          { id: 2, text: "Он пошёл в сад поливать цветы.", imageUrl: "res://garden" },
          { id: 3, text: "В саду было много красивых цветов.", imageUrl: "res://flowers" }
        ]
      },
      {
        id: "3",
        title: "Приключения Кьюрио в лесу",
        coverImage: "res://curio_garden_locked",
        episodes: [
          { id: 1, text: "Однажды Кьюрио отправился в лес.", imageUrl: "res://forest" },
          { id: 2, text: "Он встретил зайца и белку.", imageUrl: "res://garden" },
          { id: 3, text: "Вместе они нашли волшебный цветок.", imageUrl: "res://flowers" }
        ]
      }
    ];
    
    await Story.insertMany(stories);
    console.log("✅ Истории добавлены в базу");
  }
}

// ========== API РОУТЫ ==========

// 1. Авторизация через Google
app.post("/api/auth/google", async (req, res) => {
  const { token, clientId } = req.body;
  
  try {
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId
    });
    
    const payload = ticket.getPayload();
    
    let user = await User.findOne({ googleId: payload.sub });
    
    if (!user) {
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        completedStories: []
      });
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    res.json({
      id: user._id,
      googleId: user.googleId,
      email: user.email,
      name: user.name,
      picture: user.picture,
      childName: user.childName || "",
      childGender: user.childGender || "",
      completedStories: user.completedStories
    });
    
  } catch (e) {
    console.error("Auth error:", e);
    res.status(401).json({ error: "Invalid token" });
  }
});

// 2. Получить все истории
app.get("/api/stories", async (req, res) => {
  const stories = await Story.find();
  res.json(stories);
});

// 3. Получить историю по ID
app.get("/api/stories/:id", async (req, res) => {
  const story = await Story.findOne({ id: req.params.id });
  res.json(story);
});

// 4. Обновить профиль ребенка
app.post("/api/user/:userId/child-profile", async (req, res) => {
  const { childName, childGender } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { childName, childGender },
    { new: true }
  );
  res.json({
    childName: user.childName,
    childGender: user.childGender,
    completedStories: user.completedStories
  });
});

// 5. Отметить историю как прочитанную
app.post("/api/user/:userId/complete-story", async (req, res) => {
  const { storyId } = req.body;
  const user = await User.findById(req.params.userId);
  
  if (!user.completedStories.includes(storyId)) {
    user.completedStories.push(storyId);
    await user.save();
  }
  
  res.json({ completedStories: user.completedStories });
});

// 6. Получить пользователя по ID
app.get("/api/user/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    childName: user.childName,
    childGender: user.childGender,
    completedStories: user.completedStories
  });
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await initializeStories();
});