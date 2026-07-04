const express = require("express");
const { Client, GatewayIntentBits, Events } = require("discord.js");

const app = express();

app.get("/", (req, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("HTTP server running on port", PORT);
});

// BOT CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// LOAD MODULES (SAFE)
try { require("./ticket.js")(client); } catch (e) { console.log("ticket.js error:", e.message); }
try { require("./casino.js")(client); } catch (e) { console.log("casino.js error:", e.message); }
try { require("./daily.js")(client); } catch (e) { console.log("daily.js error:", e.message); }
try { require("./panel.js")(client); } catch (e) { console.log("panel.js error:", e.message); }

// READY EVENT (עדכני לדיסקורד החדש)
client.once(Events.ClientReady, () => {
  console.log("BOT ONLINE:", client.user.tag);
});

// GLOBAL ERROR CATCH (מונע קריסות)
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Promise Error:", err);
});

process.on("uncaughtException", (err) => {
  console.log("Crash Error:", err);
});

// LOGIN
client.login(process.env.DISCORD_TOKEN);
