const fs = require("fs");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = (client) => {

const FILE = "./data.json";

// =====================
// DB
// =====================
function load() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function user(data, id) {
  if (!data[id]) {
    data[id] = {
      credits: 100,
      lastDaily: 0,
      wins: 0,
      losses: 0
    };
  }
  return data[id];
}

const games = new Map();

// =====================
// READY
// =====================
client.on("ready", () => {
  console.log(`Casino Ultra Online: ${client.user.tag}`);
});

// =====================
// COMMANDS
// =====================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  let data = load();
  let u = user(data, message.author.id);

  if (message.content === "!balance") {
    return message.reply(`💳 ${u.credits} credits`);
  }

  if (message.content === "!casino") {

    const embed = new EmbedBuilder()
      .setColor("#0f0f0f")
      .setTitle("🎰 ROYAL CASINO")
      .setDescription("💰 Choose your game")
      .setImage("https://images.unsplash.com/photo-1604014237800-1c9102c3c6b4");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("coinflip").setLabel("🪙 Coinflip").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("slots").setLabel("🎰 Slots").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("roulette").setLabel("🎡 Roulette").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("crash").setLabel("💣 Crash").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("blackjack").setLabel("🃏 Blackjack").setStyle(ButtonStyle.Secondary)
    );

    return message.channel.send({ embeds: [embed], components: [row] });
  }
});

};
