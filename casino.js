const fs = require("fs");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require("discord.js");

module.exports = (client) => {

const FILE = "./data.json";

// =====================
// DB SAFE
// =====================
function load() {
  try {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE));
  } catch {
    return {};
  }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function getUser(data, id) {
  if (!data[id]) {
    data[id] = {
      credits: 100,
      wins: 0,
      losses: 0,
      lastDaily: 0
    };
  }
  return data[id];
}

// =====================
// READY
// =====================
client.on("ready", () => {
  console.log(`Casino Online: ${client.user.tag}`);
});

// =====================
// COMMANDS
// =====================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!balance") {
    const data = load();
    const u = getUser(data, message.author.id);
    return message.reply(`💳 Balance: ${u.credits}`);
  }

  if (message.content === "!casino") {

    const embed = new EmbedBuilder()
      .setColor("#111111")
      .setTitle("🎰 ROYAL CASINO")
      .setDescription("Choose a game below");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("coinflip").setLabel("🪙 Coinflip").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("slots").setLabel("🎰 Slots").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("roulette").setLabel("🎡 Roulette").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("blackjack").setLabel("🃏 Blackjack").setStyle(ButtonStyle.Secondary)
    );

    return message.channel.send({ embeds: [embed], components: [row] });
  }
});

// =====================
// INTERACTIONS SAFE
// =====================
client.on(Events.InteractionCreate, async (interaction) => {

  if (!interaction.isButton()) return;

  try {

    // 🔥 חובה: מונע 10062
    await interaction.deferReply({ ephemeral: true });

    const id = interaction.customId;

    let data = load();
    let u = getUser(data, interaction.user.id);

    // =====================
    // GAMES (SIMULATION)
    // =====================

    if (id === "coinflip") {
      const win = Math.random() > 0.5;

      if (win) {
        u.credits += 10;
        u.wins++;
        save(data);
        return interaction.editReply("🪙 You WON +10 credits");
      } else {
        u.credits -= 10;
        u.losses++;
        save(data);
        return interaction.editReply("🪙 You LOST -10 credits");
      }
    }

    if (id === "slots") {
      const win = Math.random() > 0.7;

      if (win) {
        u.credits += 25;
        u.wins++;
        save(data);
        return interaction.editReply("🎰 JACKPOT +25 credits");
      } else {
        u.credits -= 10;
        u.losses++;
        save(data);
        return interaction.editReply("🎰 Lost -10 credits");
      }
    }

    if (id === "roulette") {
      const win = Math.random() > 0.6;

      if (win) {
        u.credits += 15;
        u.wins++;
        save(data);
        return interaction.editReply("🎡 You WON +15 credits");
      } else {
        u.credits -= 15;
        u.losses++;
        save(data);
        return interaction.editReply("🎡 You LOST -15 credits");
      }
    }

    if (id === "blackjack") {
      const win = Math.random() > 0.55;

      if (win) {
        u.credits += 20;
        u.wins++;
        save(data);
        return interaction.editReply("🃏 Blackjack WIN +20");
      } else {
        u.credits -= 20;
        u.losses++;
        save(data);
        return interaction.editReply("🃏 Blackjack LOST -20");
      }
    }

  } catch (err) {
    console.log("Casino error:", err);

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

};
