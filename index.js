client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton() && !interaction.isModalSubmit()) return;

  try {
    const id = interaction.customId;

    // =========================
    // PANEL / BUTTONS / TICKET
    // =========================
    if (interaction.isButton()) {

      if (id === "panel_open") {
        return interaction.reply({
          content: "📦 Panel opened",
          ephemeral: true
        });
      }

      if (id === "buy_credits") {
        return interaction.reply({
          content: "🎫 Buy system opened",
          ephemeral: true
        });
      }

      if (id === "open_ticket") {
        return interaction.reply({
          content: "🎫 Ticket opened",
          ephemeral: true
        });
      }

      return interaction.reply({
        content: "⚡ פעולה בוצעה",
        ephemeral: true
      });
    }

    // =========================
    // MODAL HANDLING (אם יש לך בעתיד)
    // =========================
    if (interaction.isModalSubmit()) {
      return interaction.reply({
        content: "📨 נתונים התקבלו",
        ephemeral: true
      });
    }

  } catch (err) {
    console.log("INTERACTION ERROR:", err);

    try {
      if (interaction.replied || interaction.deferred) return;

      return interaction.reply({
        content: "⛔ Error occurred",
        ephemeral: true
      });
    } catch {}
  }
});
