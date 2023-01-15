const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
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
		),

    execute: async ({ client, interaction }) => {

        // verify user is in voice channel
        if (!interaction.member.voice.channel) {
            return interaction.reply("You need to be in a voice channel to play a song")
        }

        // create and play queue
        const queue = await client.player.createQueue(interaction.guild);

        // wait until connected to channel
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new EmbedBuilder()

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            
            // search for song
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })

            // finish if no tracks were found
            if (result.tracks.length === 0) {
                return interaction.reply("No results")
            }

            // add track to the queue
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
        }

        else if (interaction.options.getSubcommand() === "playlist") {

            // search for playlist
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0) {
                return interaction.reply(`No playlists found with ${url}`)
            }

            // add tracks to queue
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
                .setThumbnail(result.tracks[0].thumbnail)
        }

        else if (interaction.options.getSubcommand() === "search") {

            // search for song
            let url = interaction.options.getString("search-terms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            // finish if no tracks were found
            if (result.tracks.length === 0) {
                return interaction.editReply("No results")
            }
            
            // add track to queue
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
		}

        // play song
        if (!queue.playing) {
            await queue.play()
        }
        
        // respond with embed containing information about player
        await interaction.reply({
            embeds: [embed]
        })

    },
}
