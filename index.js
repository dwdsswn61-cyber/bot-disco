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
// GLOBAL INTERACTION FIX (IMPORTANT)
// =========================
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    // כל הלוגיקה שלך כבר בקבצים אחרים
    // זה רק "ביטוח" נגד crash ו-failed interaction

  } catch (err) {
    console.log("Interaction error:", err);

    if (interaction.isRepliable()) {
      try {
        await interaction.reply({
          content: "⛔ משהו השתבש, נסה שוב",
          ephemeral: true
        });
      } catch {}
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
