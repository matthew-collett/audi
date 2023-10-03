const { SlashCommandBuilder } = require("@discordjs/builders")

const data = () => new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resume the current song")

const execute = async ({ client, interaction }) => {
  const queue = client.player.getQueue(interaction.guildId)
  if (!queue) {
    return await interaction.reply("No songs in the queue")
  }
  queue.setPaused(false)
  await interaction.reply(`${queue.current.title} has been resumed`)
}

module.exports = { data, execute }
