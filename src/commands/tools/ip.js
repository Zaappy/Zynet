const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const { serverIP, dynmapURL } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Gives the Minecraft Server IP')
    .setDefaultMemberPermissions(PermissionFlagsBits.SendTTSMessages),

  async execute(interaction, client) {
    const ipEmbed = new EmbedBuilder()
      .setColor(client.embedColour)
      .setTitle('Zynet Minecraft Server')
      .addFields(
        {
          name: 'Server IP:',
          value: serverIP,
          inline: true,
        },
        {
          name: 'Dynmap available here:',
          value: dynmapURL,
        },
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setThumbnail(
        'https://cdn.discordapp.com/attachments/803751063093379154/1035820289218576434/zap_red_border.png',
      )
      .setTimestamp();
    await interaction.reply({
      embeds: [ipEmbed],
    });
  },
};
