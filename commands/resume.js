const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the current song"),

	execute: async ({ client, interaction }) => {

        // get queue
		const queue = client.player.getQueue(interaction.guildId)

        // check if queue is empty
		if (!queue) {
            await interaction.reply("No songs in the queue");
            return;
        }

        // pause current song
		queue.setPaused(false);

        await interaction.reply(`${queue.current.title} has been resumed`)
	},
}