const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageCollector,
} = require('discord.js');
const shell = require('shelljs');
const { serverStartScript } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Controls the Minecraft server.')
    .addSubcommand((sucommand) =>
      sucommand.setName('start').setDescription('Starts the Minecraft server'),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('stop').setDescription('Stops the Minecraft server'),
    ),

  async execute(interaction, client) {
    if (interaction.options.getSubcommand() === 'start') {
      if (
        interaction.channel.id === '962589257128611890' // Output Channel
      ) {
        const startTime = Date.now() / 1000;
        const startEmbed = new EmbedBuilder()
          .setColor(0x97a7b1)
          .setTitle('Starting server...')
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setThumbnail(
            'https://cdn.discordapp.com/attachments/962589257128611890/1031306028140204112/loading2.gif',
          )
          .setTimestamp();

        await interaction.reply({
          embeds: [startEmbed],
        });

        const filter = (startMsg) =>
          startMsg.author.id === '962590109419581470';
        const collector = new MessageCollector(
          client.channels.cache.get('990036301044666419'), // Console Channel
          {
            filter,
            max: 1,
          },
        );

        collector.on('collect', (startMsg) => {
          console.log(
            'Collected a message!\nMessage content:\n' + startMsg.content,
          );
        });
        collector.on('end', () => {
          let completeTime = Date.now() / 1000 - startTime;
          completeTime = Math.round(completeTime * 10) / 10;
          const completeEmbed = new EmbedBuilder()
            .setColor(0x547e3f)
            .setTitle('Server has started!')
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setThumbnail(
              'https://cdn.discordapp.com/attachments/962589257128611890/1031406706858655845/check-mark-button_2705.png',
            )
            .setFooter({ text: `Elapsed time: ${completeTime} seconds` })
            .setTimestamp();

          interaction.editReply({
            embeds: [completeEmbed],
          });
          return;
        });
        shell.exec(
          serverStartScript,
        );
      }
      else {
        await interaction.reply({
          content: 'You cannot run this command in this channel.',
          ephemeral: true,
        });
      }
    }
    else if (interaction.options.getSubcommand() === 'stop') {
      if (interaction.channel.id === '962589257128611890') {
        const consoleChannel = client.channels.cache.get('990036301044666419');

        try {
          const webhooks = await consoleChannel.fetchWebhooks();
          const webhook = webhooks.find((wh) => wh.token);

          if (!webhook) {
            return console.log('No webhook was found!');
          }

          await webhook.send({
            content: 'stop',
            username: 'Stopper',
            avatarURL: client.user.displayAvatarURL(),
          });
        }
        catch (error) {
          console.error('Error trying to send a message: ', error);
        }

        const stopEmbed = new EmbedBuilder()
          .setColor(0xc5272a)
          .setTitle('Stopping server!')
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setThumbnail(
            'https://cdn.discordapp.com/attachments/962589257128611890/1035759915282747442/cross-mark-button_274e.png',
          )
          .setTimestamp();
        await interaction.reply({
          embeds: [stopEmbed],
        });
      }
      else {
        await interaction.reply({
          content: 'You cannot run this command in this channel.',
          ephemeral: true,
        });
      }
    }
  },
};
