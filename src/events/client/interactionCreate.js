module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
        console.log(`Command '${interaction}' executed by @${interaction.user.username}.`);
      }
      catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'An error occurred while executing the command.',
          ephemeral: true,
        });
      }
    }
  },
};
