const express = require("express");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

const app = express();
app.use(cors());
app.use(express.json());

const client = new OAuth2Client("ТВОЙ_CLIENT_ID");

app.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "ТВОЙ_CLIENT_ID"
    });

    const payload = ticket.getPayload();

    res.json({
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    });

  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(3000, () => console.log("Server running on 3000"))
