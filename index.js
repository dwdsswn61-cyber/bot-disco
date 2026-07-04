const express = require("express");
const { Client, GatewayIntentBits, Events } = require("discord.js");

const app = express();

app.get("/", (req, res) => res.send("OK"));

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
// READY
// =========================
client.once(Events.ClientReady, () => {
  console.log(`BOT ONLINE: ${client.user.tag}`);
});

// =========================
// MESSAGE COMMANDS (כאן הכל)
// =========================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    return message.reply("🏓 Pong!");
  }

  if (message.content === "!panel") {
    return message.channel.send("📦 Panel system placeholder");
  }

  if (message.content === "!casino") {
    return message.channel.send("🎰 Casino system placeholder");
  }
});

// =========================
// INTERACTIONS (FIXED 100%)
// =========================
client.on(Events.InteractionCreate, async (interaction) => {
  try {

    if (!interaction.isRepliable()) return;

    // ⚡ חשוב: לא עושים defer כפול
    if (interaction.replied || interaction.deferred) return;

    const id = interaction.customId;

    // =====================
    // BUTTONS
    // =====================
    if (interaction.isButton()) {

      if (id === "panel_open") {
        return interaction.reply({
          content: "📦 Panel opened",
          ephemeral: true
        });
      }

      if (id === "buy_credits") {
        return interaction.reply({
          content: "🎫 Buy Credits opened",
          ephemeral: true
        });
      }

      if (id === "open_ticket") {
        return interaction.reply({
          content: "🎫 Ticket opened",
          ephemeral: true
        });
      }

      return interaction.reply({
        content: "⚡ Unknown button",
        ephemeral: true
      });
    }

    // =====================
    // MODALS (אם תוסיף בעתיד)
    // =====================
    if (interaction.isModalSubmit()) {
      return interaction.reply({
        content: "📩 Modal received",
        ephemeral: true
      });
    }

  } catch (err) {
    console.log("INTERACTION ERROR:", err);

    try {
      if (!interaction.replied) {
        await interaction.reply({
          content: "⛔ Error occurred",
          ephemeral: true
        });
      }
    } catch {}
  }
});

// =========================
// GLOBAL SAFETY
// =========================
process.on("unhandledRejection", (err) => {
  console.log("Unhandled:", err);
});

process.on("uncaughtException", (err) => {
  console.log("Crash:", err);
});

client.login(process.env.DISCORD_TOKEN);
