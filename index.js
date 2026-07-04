const express = require("express");
const { Client, GatewayIntentBits, Events } = require("discord.js");

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("HTTP server running on port", PORT);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// =========================
// LOAD MODULES (DEBUG אמיתי)
// =========================
function loadModule(name) {
  try {
    require(name)(client);
    console.log(`✅ Loaded ${name}`);
  } catch (e) {
    console.log(`❌ Failed loading ${name}:`, e.message);
  }
}

loadModule("./ticket.js");
loadModule("./casino.js");
loadModule("./daily.js");
loadModule("./panel.js");

// =========================
// READY
// =========================
client.once(Events.ClientReady, () => {
  console.log("BOT ONLINE:", client.user.tag);
});

// =========================
// GLOBAL INTERACTION SAFETY
// =========================
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isRepliable()) return;
  } catch (err) {
    console.log("Interaction error:", err);
  }
});

client.login(process.env.DISCORD_TOKEN);
