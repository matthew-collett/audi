require("dotenv").config()

const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v10")
const { Client, GatewayIntentBits, Collection } = require("discord.js")
const { Player } = require("discord-player")

const fs = require("fs")
const path = require("path")

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates]
})

const commands = []
client.commands = new Collection()

const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"))

commandFiles.forEach(file => {
  const command = require(path.join(commandsPath, file))
  client.commands.set(command.data.name, command)
  commands.push(command.data.toJSON())
})

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25
  }
})

client.once("ready", () => {
  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN)
  client.guilds.cache.forEach(guild => {
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id), { body: commands })
      .then(() => console.log(`Added commands to ${guild.id}`))
      .catch(console.error)
  })
})

client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isCommand() && client.commands.get(interaction.commandName)) {
      await client.commands.get(interaction.commandName).execute({ client, interaction })
    }
  } catch (err) {
    console.error(err)
    await interaction.reply("An error occurred while executing that command")
  }
})

client.login(process.env.TOKEN)
