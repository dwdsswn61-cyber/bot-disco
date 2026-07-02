const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log("BOT IS ONLINE");
});

client.login(process.env.DISCORD_TOKEN);
