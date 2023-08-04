module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Client has logged in as @${client.user.tag}.`);
  },
};
