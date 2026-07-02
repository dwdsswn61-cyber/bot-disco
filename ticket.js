const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField,
  Events
} = require("discord.js");

module.exports = (client) => {

  // =========================
  // PANEL COMMAND
  // =========================
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!ticketpanel") {

      const embed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle("📌 SUPPORT PANEL")
        .setDescription("לחץ על הכפתור לפתיחת טיקט");

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("open_ticket")
          .setLabel("🎫 Open Ticket")
          .setStyle(ButtonStyle.Success)
      );

      await message.channel.send({
        embeds: [embed],
        components: [row]
      });
    }
  });

  // =========================
  // BUTTON + MODAL
  // =========================
  client.on(Events.InteractionCreate, async (interaction) => {

    // OPEN MODAL
    if (interaction.isButton() && interaction.customId === "open_ticket") {

      const modal = new ModalBuilder()
        .setCustomId("ticket_modal")
        .setTitle("🎫 Create Ticket");

      const name = new TextInputBuilder()
        .setCustomId("name")
        .setLabel("השם שלך")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const reason = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("סיבה לטיקט")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(reason)
      );

      await interaction.showModal(modal);
    }

    // CREATE CHANNEL
    if (interaction.isModalSubmit() && interaction.customId === "ticket_modal") {

      const name = interaction.fields.getTextInputValue("name");
      const reason = interaction.fields.getTextInputValue("reason");

      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory
            ]
          }
        ]
      });

      const embed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setTitle("📩 Ticket Created")
        .setDescription(
          `👤 שם: ${name}\n❓ סיבה: ${reason}\n👤 משתמש: ${interaction.user}`
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("close_ticket")
          .setLabel("🔒 Close Ticket")
          .setStyle(ButtonStyle.Danger)
      );

      await channel.send({
        embeds: [embed],
        components: [row]
      });

      await interaction.reply({
        content: `✔ הטיקט נפתח: ${channel}`,
        ephemeral: true
      });
    }

    // CLOSE TICKET
    if (interaction.isButton() && interaction.customId === "close_ticket") {

      await interaction.reply({
        content: "🔒 סוגר טיקט..."
      });

      setTimeout(() => {
        interaction.channel.delete();
      }, 3000);
    }
  });

};