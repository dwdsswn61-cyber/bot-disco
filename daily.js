const {
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const fs = require("fs");

module.exports = (client) => {

const FILE = "./data.json";

// =========================
// DB
// =========================
function load() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function getUser(data, id) {
  if (!data[id]) {
    data[id] = {
      credits: 0,
      lastDaily: 0
    };
  }
  return data[id];
}

// =========================
// MESSAGE COMMAND
// =========================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!daily") {

    const embed = new EmbedBuilder()
      .setColor("#57F287")
      .setTitle("💰 Daily Reward")
      .setDescription("לחץ על הכפתור כדי לקבל 5 credits כל 24 שעות");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("claim_daily")
        .setLabel("💰 Claim Daily")
        .setStyle(ButtonStyle.Success)
    );

    return message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

// =========================
// INTERACTIONS (FIXED)
// =========================
client.on(Events.InteractionCreate, async (interaction) => {
  try {

    if (!interaction.isButton()) return;
    if (interaction.customId !== "claim_daily") return;

    // 🔥 חשוב נגד 10062
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply({ ephemeral: true }).catch(() => {});
    }

    let data = load();
    let user = getUser(data, interaction.user.id);

    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;

    if (now - user.lastDaily < cooldown) {
      const remaining = cooldown - (now - user.lastDaily);
      const hours = Math.floor(remaining / 3600000);

      return interaction.editReply(
        `❌ כבר לקחת daily!\n⏳ נסה שוב בעוד ${hours} שעות`
      );
    }

    user.credits += 5;
    user.lastDaily = now;

    save(data);

    return interaction.editReply(
      `💰 קיבלת 5 credits!\n💳 עכשיו יש לך: ${user.credits}`
    );

  } catch (err) {
    console.log("Daily error:", err);

    try {
      if (!interaction.replied) {
        await interaction.reply({
          content: "⛔ שגיאה, נסה שוב",
          ephemeral: true
        });
      }
    } catch {}
  }
});

};
