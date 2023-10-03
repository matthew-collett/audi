# AudiBot
AudiBot is a Discord bot that allows users to play audio from YouTube in their Discord server. The bot is built using the Discord.js library and supports slash commands, making it easy for users to play audio without having to use complex commands.

## How it Works
AudiBot uses the Discord Player library to play audio from YouTube, and supports features such as queue management, playing by search, url, and can also play playlists.

## Installation
After you have cloned the repo make sure to create a `.env` file with the `TOKEN` and `CLIENT_ID` specified for example

```
TOKEN=xxx
CLIENT_ID=xxx
```

# Commands
- ```/play```
  - ```/song {url}```       - Plays the song from the youtube url
  - ```/search {keyword}``` - Searches for the keyword on youtube and plays the first result
  - ```/playlist {url}```   - Plays the playlist from url

- ```/skip```   - Skips the current song
- ```/queue```  - Displays the first 10 songs in the queue
- ```/pause```  - Pauses the current song
- ```/resume``` - Resumes playing the current song
- ```/exit```   - Kicks the bot from the voice channel
