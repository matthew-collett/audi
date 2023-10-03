const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

const data = () => new SlashCommandBuilder()
  .setName("play")
  .setDescription("play a song from YouTube")
  .addSubcommand(subcommand =>
    subcommand
      .setName("search")
      .setDescription("Search for a song and play it on YouTube")
      .addStringOption(option =>
        option.setName("search-terms").setDescription("Search keywords").setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName("playlist")
      .setDescription("Play a playlist from YouTube")
      .addStringOption(option => option.setName("url").setDescription("The playlist's URL").setRequired(true))
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName("song")
      .setDescription("Play a single song from YouTube")
      .addStringOption(option => option.setName("url").setDescription("The song's URL").setRequired(true))
  )

const createEmbed = (description, thumbnail, footerText) => {
  return new MessageEmbed()
    .setDescription(description)
    .setThumbnail(thumbnail)
    .setFooter(footerText)
}

const execute = async ({ client, interaction }) => {
  if (!interaction.member.voice.channel) {
    return await interaction.reply("You need to be in a voice channel to play a song")
  }

  const queue = await client.player.createQueue(interaction.guild)
  if (!queue.connection) {
    await queue.connect(interaction.member.voice.channel)
  }

  const searchTerm = interaction.options.getString(interaction.options.getSubcommand() === "search" ? "search-terms" : "url")
  let embed
  let result

  switch (interaction.options.getSubcommand()) {
    case "song":
      result = await client.player.search(searchTerm, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO
      })
      if (result.tracks.length) {
        await queue.addTrack(result.tracks[0])
        embed = createEmbed(`**[${result.tracks[0].title}](${result.tracks[0].url})** has been added to the queue`, result.tracks[0].thumbnail, `Duration: ${result.tracks[0].duration}`)
      }
      break

    case "playlist":
      result = await client.player.search(searchTerm, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST
      })
      if (result.tracks.length) {
        await queue.addTracks(result.tracks)
        embed = createEmbed(`**${result.tracks.length} songs from [${result.playlist.title}](${result.playlist.url})** have been added to the Queue`, result.tracks[0].thumbnail)
      }
      break

    case "search":
      result = await client.player.search(searchTerm, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO
      })
      if (result.tracks.length) {
        await queue.addTrack(result.tracks[0])
        embed = createEmbed(`**[${result.tracks[0].title}](${result.tracks[0].url})** has been added to the Queue`, result.tracks[0].thumbnail, `Duration: ${result.tracks[0].duration}`)
      }
      break
  }

  if (!result || result.tracks.length === 0) {
    return interaction.reply(`No results found for ${searchTerm}`)
  }

  if (!queue.playing) {
    await queue.play()
  }
  await interaction.reply({ embeds: [embed] })
}

module.exports = { data, execute }
