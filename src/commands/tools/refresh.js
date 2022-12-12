const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emojirefresh')
    .setDescription('Refreshes the emoji list in #emoji.')
    .setDefaultMemberPermissions(0),

  async execute(interaction, client) {
    // Starting application command interaction
    interaction.reply({
      content: '<a:loading:1031305776653947010> Refreshing emoji list...',
      ephemeral: true,
    });
    const emojiChannel = client.channels.cache.get('962914629376409620'); // #emoji channel ID

    // Creating the emoji ID array
    const emojiList = await interaction.guild.emojis
      .fetch()
      .catch(console.error);
    const emojiInfo = [];
    const emojiIDs = [];
    emojiList.forEach((info, id) => {
      emojiInfo.push(info);
      emojiIDs.push(id);
    });
    const emojiURLs = emojiIDs.map( // emojiIDs is now an array of emoji URLs
      (i) => 'https://cdn.discordapp.com/emojis/' + i,
    );

    // Sending webhook messages
    try {
      // Find webhook and token
      const webhooks = await emojiChannel.fetchWebhooks();
      const webhook = webhooks.find((wh) => wh.token);
      if (!webhook) {
        return console.log('No webhook was found!');
      }

      emojiChannel
        .bulkDelete(100) // Deletes all previous messages (there should never be more than 100 anyways)
        .then((messages) =>
          console.log(`Bulk deleted ${messages.size} messages.`),
        )
        .catch(console.error);

      for (let i = 0; i < emojiIDs.length; i++) {
        const emojiEmbed = new EmbedBuilder() // Create webhook embeds
          .setColor(client.embedColour)
          .setTitle(`:${emojiInfo[i].name}:`)
          .setThumbnail(emojiURLs[i])
          .setFooter({ text: `Emoji ID: ${emojiIDs[i]}` });

        await webhook.send({
          // Send webhook messages
          username: 'Zappy\'s Server Emojis',
          avatarURL: client.user.displayAvatarURL(),
          embeds: [emojiEmbed],
        });
      }
    }
    catch (error) {
      console.error('Error trying to send a message: ', error);
    }

    // Finishing application command interaction
    await interaction.editReply({
      content: 'Emoji list refreshed.',
      ephemeral: true,
    });
  },
};
