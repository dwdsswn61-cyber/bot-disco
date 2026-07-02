const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// מפעיל מערכות
require("./ticket.js")(client);
require("./casino.js")(client);
require("./daily.js")(client);

// ===== EXPRESS FIX (חשוב ל-Render) =====
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Web server running");
});

// ===== DISCORD READY =====
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// ===== LOGIN =====
client.login(process.env.DISCORD_TOKEN);
