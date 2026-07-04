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

    // 🔥 הכי חשוב: תשובה אחת בלבד, עם TRY SAFE
    if (interaction.deferred) {
      return interaction.editReply({
        content: `${result}\n💳 Balance: ${u.credits}`
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
