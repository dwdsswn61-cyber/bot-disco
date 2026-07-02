const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

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

require("./ticket.js")(client);
require("./casino.js")(client);
require("./daily.js")(client);

client.once("ready", () => {
  console.log("BOT ONLINE:", client.user.tag);
});

client.login(process.env.DISCORD_TOKEN);
