const { SlashCommandBuilder } = require("@discordjs/builders");

const data = () => new SlashCommandBuilder()
	.setName("pause")
	.setDescription("Pause the current song")

const execute = async ({ client, interaction }) => {
	const queue = client.player.getQueue(interaction.guildId);
	if (!queue) {
		return await interaction.reply("There are no songs in the queue")
	}
	queue.setPaused(true)
	await interaction.reply(`${queue.current.title} has been paused`)
};

module.exports = { data, execute }
