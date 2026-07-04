const express = require("express");
const { Client, GatewayIntentBits, Events } = require("discord.js");

const app = express();
app.get("/", (req, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("HTTP server running on port", PORT);
});

// ✅ חייב להיות לפני כל require
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// =========================
// LOAD MODULES (SAFE)
// =========================
const modules = ["ticket", "casino", "daily", "panel"];

modules.forEach(m => {
  try {
    require(`./${m}.js`)(client);
    console.log(`✅ Loaded ${m}.js`);
  } catch (e) {
    console.log(`❌ Missing ${m}.js`);
  }
});

// =========================
// READY
// =========================
client.once(Events.ClientReady, () => {
  console.log("BOT ONLINE:", client.user.tag);
});

// =========================
// GLOBAL SAFETY (לא הורס כלום)
// =========================
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isRepliable()) return;

    // 🔥 מונע קריסה של Unknown interaction
    if (interaction.deferred || interaction.replied) return;

    // לא עושה כלום כאן (רק מגן)
  } catch (err) {
    console.log("GLOBAL ERROR:", err);
  }
});

client.login(process.env.DISCORD_TOKEN);
