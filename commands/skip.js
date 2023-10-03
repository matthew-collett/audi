const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

const data = () => new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skip the current song")

const execute = async ({ client, interaction }) => {
  const queue = client.player.getQueue(interaction.guildId)
  if (!queue) {
    return await interaction.reply("There are no songs in the queue")
  }
  const currentSong = queue.current
  queue.skip()

  const embed = new MessageEmbed()
    .setDescription(`${currentSong.title} has been skipped`)
    .setThumbnail(currentSong.thumbnail)
  
  await interaction.reply({ embeds: [embed] })
}

module.exports = { data, execute }
