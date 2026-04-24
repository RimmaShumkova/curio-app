const express = require("express");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

const app = express();
app.use(cors());
app.use(express.json());

const client = new OAuth2Client("ТВОЙ_CLIENT_ID");

const User = require("./models/User"); // добавить вверху

app.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "ТВОЙ_CLIENT_ID"
    });

    const payload = ticket.getPayload();

    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      });

      await user.save();
    }

    res.json(user);

  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(3000, () => console.log("Server running on 3000"))

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/curio", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));
