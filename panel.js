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

    message.channel.send({
      content:
`──────────────────────────────
            PANEL
──────────────────────────────

הוראות שימוש:

1 - לחץ על כפתור Panel🚀 למטה
2 - הזן שם בתוך החלון שנפתח
3 - הזן מה קורה בתוך החלון
4 - לחץ שלח

עלות כל פעולה: קרדיט אחד
משך פעולה: 35 שניות (סימולציה)

──────────────────────────────`,
      components: [row]
    });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {

  if (!interaction.isButton() && !interaction.isModalSubmit()) return;

  // OPEN MODAL
  if (interaction.isButton() && interaction.customId === "panel_open") {

    const modal = new ModalBuilder()
      .setCustomId("panel_modal")
      .setTitle("PANEL MENU");

    const name = new TextInputBuilder()
      .setCustomId("name")
      .setLabel("מספר טלפון: *")

      .setStyle(TextInputStyle.Short);

    const msg = new TextInputBuilder()
      .setCustomId("msg")
      .setLabel("קרדיטים"): *

      .setStyle(TextInputStyle.Paragraph);

    modal.addComponents(
      new ActionRowBuilder().addComponents(name),
      new ActionRowBuilder().addComponents(msg)
    );

    await interaction.showModal(modal);
  }

  // BUY CREDITS
  if (interaction.isButton() && interaction.customId === "buy_credits") {
    return interaction.reply({
      content: "🎫 Buy Credits opened (simulation)",
      ephemeral: true
    });
  }

  // MODAL RESULT (אותו עיצוב שלך בדיוק)
  if (interaction.isModalSubmit() && interaction.customId === "panel_modal") {

    const name = interaction.fields.getTextInputValue("name");
    const msg = interaction.fields.getTextInputValue("msg");

    return interaction.reply({
      content:
`┌──────────────────────────┐
│        PANEL MENU        │
├──────────────────────────┤
│ מספר טלפון: *
│ ${name}
│                          │
│ קרדיטים: *
│ ${msg}
│                          │
│        [ שלח ]           │
└──────────────────────────┘`,
      ephemeral: true
    });
  }

});

};
