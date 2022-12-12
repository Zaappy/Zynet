const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows your ping.'),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    const latencyEmbed = new EmbedBuilder()
      .setColor(client.embedColour)
      .setTitle('Pong!')
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setThumbnail(
        'https://cdn.discordapp.com/attachments/803751063093379154/1035820289218576434/zap_red_border.png',
      )
      .addFields([
        {
          name: 'API Latency',
          value: `${client.ws.ping} ms`,
          inline: true,
        },
        {
          name: 'Client Ping',
          value: `${
            message.createdTimestamp - interaction.createdTimestamp
          } ms`,
          inline: true,
        },
      ])
      .setTimestamp();
    await interaction.editReply({
      embeds: [latencyEmbed],
    });
  },
};
