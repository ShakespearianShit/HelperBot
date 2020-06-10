const ColorScheme = require('color-scheme');
const { Client } = require("discord.js");
const client = new Client();
const config = require("./config.json");

client.on("ready", () => {
  console.log("yes");
  client.user.setActivity("S̴̱̾ĺ̶ͅa̴͔̍v̶̦͛i̸̯͒n̸̜̏g̵̀͜ ̴̙͊o̶͉͒f̷̰̽f̸͍̑ ̵̦̂ḯ̷͕n̵̢̎ ̷̺͘W̶̮̅í̶̺l̸̙̎l̶̳̈y̶̞̏'̸͓̃s̴͙̄ ̸̡̅ḃ̴̤ȃ̷̯s̶͍͑e̷͔̓m̵̟̏e̶͇͝n̵͉̔t̵̛͜");
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
  
  if (command === "analogic") {
	  var hueColor = hsl(`#${req.color1}`)[0]
	  var scheme = new ColorScheme;

    scheme.from_hue(hueColor)
	  scheme.scheme('analogic')
	  scheme.add_complement(true)
	  scheme.variation('hard')
  }
  
  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
  }
});

client.login(process.env.TOKEN)