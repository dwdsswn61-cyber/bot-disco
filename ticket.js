const {
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField
} = require("discord.js");

module.exports = (client) => {

  console.log("ticket.js loaded");

  let ticketCounter = 0;

  // =========================
  // PANEL COMMAND
  // =========================
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!ticketpanel") {

      const embed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle("📌 SUPPORT PANEL")
        .setDescription(
`━━━━━━━━━━━━━━━
❓ צריך עזרה?

🚀 לחץ על הכפתור למטה כדי לפתוח טיקט
👨‍💻 צוות השרת יעזור לך
━━━━━━━━━━━━━━━`
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("open_ticket")
          .setLabel("🎫 Open Ticket")
          .setStyle(ButtonStyle.Success)
      );

      return message.channel.send({
        embeds: [embed],
        components: [row]
      });
    }
  });

  // =========================
  // INTERACTIONS
  // =========================
  client.on(Events.InteractionCreate, async (interaction) => {

    try {

      if (!interaction.isButton() && !interaction.isModalSubmit()) return;

      // =========================
      // OPEN MODAL
      // =========================
      if (interaction.isButton() && interaction.customId === "open_ticket") {

        const modal = new ModalBuilder()
          .setCustomId("ticket_modal")
          .setTitle("🎫 Open Ticket");

        const name = new TextInputBuilder()
          .setCustomId("name")
          .setLabel("מה השם שלך בשרת?")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("לדוגמה: Player123")
          .setRequired(true);

        const reason = new TextInputBuilder()
          .setCustomId("reason")
          .setLabel("מה הסיבה לפתיחת הטיקט?")
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder("תסביר למה אתה צריך עזרה")
          .setRequired(true);

        modal.addComponents(
          new ActionRowBuilder().addComponents(name),
          new ActionRowBuilder().addComponents(reason)
        );

        return interaction.showModal(modal);
      }

      // =========================
      // CREATE TICKET
      // =========================
      if (interaction.isModalSubmit() && interaction.customId === "ticket_modal") {

        const name = interaction.fields.getTextInputValue("name");
        const reason = interaction.fields.getTextInputValue("reason");

        ticketCounter++;

        const channel = await interaction.guild.channels.create({
          name: `ticket-${ticketCounter}`,
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
`👤 שם: ${name}
❓ סיבה: ${reason}
🆔 יוצר: ${interaction.user.tag}`
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

        return interaction.reply({
          content: `✔️ נפתח טיקט: ${channel}`,
          ephemeral: true
        });
      }

      // =========================
      // CLOSE TICKET
      // =========================
      if (interaction.isButton() && interaction.customId === "close_ticket") {

        await interaction.reply({
          content: "🔒 סוגר טיקט..."
        });

        setTimeout(() => {
          interaction.channel.delete().catch(() => {});
        }, 1500);
      }

    } catch (err) {
      console.log("Ticket error:", err);

      if (!interaction.replied && !interaction.deferred) {
        try {
          await interaction.reply({
            content: "❌ שגיאה בטיקט",
            ephemeral: true
          });
        } catch {}
      }
    }

  });

};
