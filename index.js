const express = require("express");
const { Client, GatewayIntentBits, Events } = require("discord.js");

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// חייב להיות לפני הבוט כדי ש-Render יזהה פורט
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
// LOAD MODULES
// =========================
require("./ticket.js")(client);
require("./casino.js")(client);
require("./daily.js")(client);
require("./panel.js")(client);

// =========================
// READY
// =========================
client.once(Events.ClientReady, () => {
  console.log("BOT ONLINE:", client.user.tag);
});

// =========================
// GLOBAL FIX (SAFE INTERACTIONS)
// =========================
client.on(Events.InteractionCreate, async (interaction) => {
  try {

    if (!interaction.isRepliable()) return;

  } catch (err) {
    console.log("Interaction error:", err);

    try {
      if (
        interaction.isRepliable?.() &&
        !interaction.replied &&
        !interaction.deferred
      ) {
        await interaction.reply({
          content: "⛔ משהו השתבש, נסה שוב",
          flags: 64
        });
      }
    } catch {}
  }
});

// =========================
client.login(process.env.DISCORD_TOKEN);
