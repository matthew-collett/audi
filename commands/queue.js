const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

const data = () => new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Show first 10 songs in the queue")

const execute = async ({ client, interaction }) => {
  const queue = client.player.getQueue(interaction.guildId)
  if (!queue || !queue.playing) {
    return await interaction.reply("There are no songs in the queue")
  }

  const queueString = queue.tracks
    .slice(0, 10)
    .map((song, i) => `${i + 1}) [${song.duration}] - ${song.title}`)
    .join("\n\n")
  
  const embed = new MessageEmbed()
    .setDescription(`**Currently Playing**\n[${queue.current.duration}] - ${queue.current.title}\n\n**Queue**\n${queueString}`)
    .setThumbnail(queue.current.thumbnail)
    
  await interaction.reply({ embeds: [embed] })
}

module.exports = { data, execute }
