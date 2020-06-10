const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
  console.log("yes");
  client.user.setActivity("Slaving off in Willy's b̶a̶s̶e̶m̶e̶n̶t̶ server");
});

client.on("message", async message => {
  if(message.author.bot) return;

  if(message.channel.type == "text" && message.channel.name.toLowerCase() == "ideas" || message.channel.name.toLowerCase() == "programming-ideas" || message.channel.name.toLowerCase() == "design-ideas"){
    message.react("✅");
    message.react("❌");
  }
  
  if(!message.content.startsWith(config.prefix)) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
  }
  
  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
  }
});

client.login(config.token);