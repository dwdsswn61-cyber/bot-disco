const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events
} = require("discord.js");

module.exports = (client) => {

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!panel") {

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("panel_open")
          .setLabel("Panel🚀")
          .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
          .setCustomId("buy_credits")
          .setLabel("🎫 Buy Credits")
          .setStyle(ButtonStyle.Success)
      );

      return message.channel.send({
        content:
`──────────────────────────────
            PANEL
──────────────────────────────

הוראות שימוש:

1 - לחץ על כפתור Panel🚀 למטה
2 - הזן מספר טלפון
3 - הזן קרדיטים
4 - לחץ שלח

עלות כל פעולה: קרדיט אחד
משך פעולה: 35 שניות (סימולציה)

──────────────────────────────`,
        components: [row]
      });
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {

    try {

      if (!interaction.isButton() && !interaction.isModalSubmit()) return;

      // =========================
      // PANEL OPEN (FIXED)
      // =========================
      if (interaction.isButton() && interaction.customId === "panel_open") {

        const modal = new ModalBuilder()
          .setCustomId("panel_modal")
          .setTitle("PANEL MENU");

        const phone = new TextInputBuilder()
          .setCustomId("phone")
          .setLabel("Phone Number")
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const credits = new TextInputBuilder()
          .setCustomId("credits")
          .setLabel("Credits")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        modal.addComponents(
          new ActionRowBuilder().addComponents(phone),
          new ActionRowBuilder().addComponents(credits)
        );

        return interaction.showModal(modal);
      }

      // =========================
      // BUY CREDITS
      // =========================
      if (interaction.isButton() && interaction.customId === "buy_credits") {

        return interaction.reply({
          content: "🎫 Buy Credits opened (simulation)",
          ephemeral: true
        });
      }

      // =========================
      // MODAL RESULT
      // =========================
      if (interaction.isModalSubmit() && interaction.customId === "panel_modal") {

        const phone = interaction.fields.getTextInputValue("phone");
        const credits = interaction.fields.getTextInputValue("credits");

        return interaction.reply({
          content:
`┌──────────────────────────┐
│        PANEL MENU        │
├──────────────────────────┤
│ מספר טלפון: *
│ ${phone}
│                          │
│ קרדיטים: *
│ ${credits}
│                          │
│        [ שלח ]           │
└──────────────────────────┘`,
          ephemeral: true
        });
      }

    } catch (err) {
      console.log("Panel error:", err);

      if (!interaction.replied && !interaction.deferred) {
        try {
          await interaction.reply({
            content: "❌ שגיאה במערכת",
            ephemeral: true
          });
        } catch {}
      }
    }

  });

};
