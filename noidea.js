const Discord = require("discord.js")
const client = new Discord.Client()

client.on('ready', () => {
  console.log("Up and ready to rock")
})

client.on('message', async message => {
  if (message.content.includes("Go ahead")){
    const messageToSend = message.content.replace("Go ahead ", "")
    client.channels.cache.get("562896458496344089").send(messageToSend)
  }
})

client.login(process.env.TOKEN)