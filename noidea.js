const Discord = require("discord.js")
const client = new Discord.Client()


client.on('ready', () => {
  client.channels.cache.get("562896458496344089").send(";-;")
})

client.login(process.env.TOKEN)