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
    const raw = fs.readFileSync(FILE, "utf8");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.log("DB load error:", e);
    return {};
  }
}

function save(data) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("DB save error:", e);
  }
}

function getUser(data, id) {
  if (!data[id]) {
    data[id] = {
      credits: 100,
      wins: 0,
      losses: 0
    };
  }
  return data[id];
}

// =====================
// READY
// =====================
client.once(Events.ClientReady, () => {
  console.log(`✅ Casino Online: ${client.user.tag}`);
});

// =====================
// COMMAND
// =====================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!casino") {

    const embed = new EmbedBuilder()
      .setColor("#111111")
      .setTitle("🎰 ROYAL CASINO")
      .setDescription("Choose a game");

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
// INTERACTIONS SAFE FIX
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
      result = win ? "🪙 WIN +10" : "🪙 LOSE -10";
    }

    if (id === "slots") {
      const win = Math.random() > 0.7;
      u.credits += win ? 25 : -10;
      win ? u.wins++ : u.losses++;
      result = win ? "🎰 JACKPOT +25" : "🎰 LOSE -10";
    }

    if (id === "roulette") {
      const win = Math.random() > 0.6;
      u.credits += win ? 15 : -15;
      win ? u.wins++ : u.losses++;
      result = win ? "🎡 WIN +15" : "🎡 LOSE -15";
    }

    if (id === "blackjack") {
      const win = Math.random() > 0.55;
      u.credits += win ? 20 : -20;
      win ? u.wins++ : u.losses++;
      result = win ? "🃏 WIN +20" : "🃏 LOSE -20";
    }

    save(data);

    // =====================
    // SAFE REPLY (מונע 10062)
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
    console.log("❌ Casino error:", err);

    try {
      if (!interaction.replied && !interaction.deferred) {
        return interaction.reply({
          content: "❌ Error occurred",
          ephemeral: true
        });
      }
    } catch {}
  }
});

};
