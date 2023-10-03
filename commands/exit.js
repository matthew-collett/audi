const { SlashCommandBuilder } = require("@discordjs/builders")

const data = () => new SlashCommandBuilder()
  .setName("exit")
  .setDescription("Kick the bot from the channel")

const execute = async ({ client, interaction }) => {
	const queue = client.player.getQueue(interaction.guildId)
	if (!queue) {
		return await interaction.reply("There are no songs in the queue")
	}
	queue.destroy()
	await interaction.reply("Audio bot has been kicked from the channel")
}

module.exports = { data, execute }