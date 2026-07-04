client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton() && !interaction.isModalSubmit()) return;

  try {
    if (interaction.deferred || interaction.replied) return;

    await interaction.deferReply({ ephemeral: true });

    // כפתורים
    const id = interaction.customId;

    // PANEL
    if (id === "panel_open") {
      return interaction.editReply("📦 Panel opened");
    }

    if (id === "buy_credits") {
      return interaction.editReply("🎫 Buy system opened");
    }

    if (id === "open_ticket") {
      return interaction.editReply("🎫 Ticket opened");
    }

    // CASINO fallback
    return interaction.editReply("⚡ פעולה בוצעה");

  } catch (err) {
    console.log("INTERACTION ERROR:", err);

    try {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "⛔ Error occurred",
          ephemeral: true
        });
      }
    } catch {}
  }
});
