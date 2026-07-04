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
// INTERACTIONS SAFE FIXED
// =====================
client.on(Events.InteractionCreate, async (interaction) => {

  if (!interaction.isButton()) return;

  try {

    const id = interaction.customId;

    let data = load();
    let u = getUser(data, interaction.user.id);

    let result = "";

    if (id === "coinflip") {
      const win = Math.random() > 0.5;
      u.credits += win ? 10 : -10;
      win ? u.wins++ : u.losses++;
      result = win ? "🪙 You WON +10 credits" : "🪙 You LOST -10 credits";
    }

    if (id === "slots") {
      const win = Math.random() > 0.7;
      u.credits += win ? 25 : -10;
      win ? u.wins++ : u.losses++;
      result = win ? "🎰 JACKPOT +25 credits" : "🎰 Lost -10 credits";
    }

    if (id === "roulette") {
      const win = Math.random() > 0.6;
      u.credits += win ? 15 : -15;
      win ? u.wins++ : u.losses++;
      result = win ? "🎡 You WON +15 credits" : "🎡 You LOST -15 credits";
    }

    if (id === "blackjack") {
      const win = Math.random() > 0.55;
      u.credits += win ? 20 : -20;
      win ? u.wins++ : u.losses++;
      result = win ? "🃏 Blackjack WIN +20" : "🃏 Blackjack LOST -20";
    }

    save(data);

    // =====================
    // SAFE REPLY FIX (10062 FIX)
    // =====================
    if (interaction.replied || interaction.deferred) {
      return interaction.followUp({
        content: `${result}\n💳 Balance: ${u.credits}`,
        ephemeral: true
      });
    }

    return interaction.reply({
      content: `${result}\n💳 Balance: ${u.credits}`,
      ephemeral: true
    });

  } catch (err) {
    console.log("Casino error:", err);

    try {
      if (interaction.replied || interaction.deferred) return;

      return interaction.reply({
        content: "⛔ Error occurred",
        ephemeral: true
      });
    } catch {}
  }
});

};
