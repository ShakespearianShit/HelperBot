const Discord = require("discord.js")
const client = new Discord.Client()

client.login(process.env.TOKEN)

const channel = client.channels.find('name', channelName)
