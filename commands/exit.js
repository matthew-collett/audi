const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Kick the bot from the channel"),

	execute: async ({ client, interaction }) => {

        // get current queue
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) {
			await interaction.reply("There are no songs in the queue")
			return;
		}

        // deletes all the songs from queue and exits the channel
		queue.destroy();
        await interaction.reply("Nicky don't leave me ://")
	},
}