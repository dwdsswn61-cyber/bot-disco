const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const app = express();

// חשוב מאוד - חייב לרוץ לפני הכל
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("HTTP server is running");
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log("BOT ONLINE:", client.user.tag);
});

require("./ticket.js")(client);
require("./casino.js")(client);
require("./daily.js")(client);

client.login(process.env.DISCORD_TOKEN);
