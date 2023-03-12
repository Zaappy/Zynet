const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emojirefresh')
    .setDescription('Refreshes the #emoji channel')
    .setDefaultMemberPermissions(0),

  async execute(interaction, client) {
    const emojiList = await interaction.guild.emojis // Create emoji arrays
      .fetch()
      .catch(console.error);
    const emojiInfo = [];
    const emojiIDs = [];
    emojiList.forEach((info, id) => {
      emojiInfo.push(info);
      emojiIDs.push(id);
    });
    const emojiURLs = emojiIDs.map(
      (i) => 'https://cdn.discordapp.com/emojis/' + i,
    );

    interaction.reply({
      content: '<a:loading:1031305776653947010> Refreshing emoji list...',
      ephemeral: true,
    });

    interaction.channel.clone() // Create channel clone
      .then(channel => {
        console.log(`Created new channel '#${channel.name}' with ID: ${channel.id}.`);

        for (let i = 0; i < emojiIDs.length; i++) { // Create emoji embeds
          if (!emojiInfo[i].animated) { // Not animated emojis
            const emojiEmbed = new EmbedBuilder()
              .setColor(client.embedColour)
              .setTitle(`:${emojiInfo[i].name}:`)
              .setThumbnail(emojiURLs[i])
              .setFooter({ text: `Emoji ID: ${emojiIDs[i]}` });

            channel.send({ embeds: [emojiEmbed] });
          }
          else { // Animated emojis
            const emojiEmbed = new EmbedBuilder()
              .setColor(client.embedColour)
              .setTitle(`:${emojiInfo[i].name}:`)
              .setThumbnail(emojiURLs[i] + '.gif')
              .setFooter({ text: `Emoji ID: ${emojiIDs[i]}` });

            channel.send({ embeds: [emojiEmbed] });
          }
        }
      })
      .catch(console.error);

    interaction.channel.delete() // Delete old channel
      .then(channel => {
        console.log(`Deleted channel '#${channel.name}' with ID: ${channel.id}.`);
      })
      .catch(console.error);
  },
};