const ColorScheme = require("color-scheme");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const got = require("got");
const hsl = require("hex-to-hsl");
const config = require("./config.json");
const canvas = require("canvas");
const ms = require("ms");
var realTime;

client.on("ready", () => {
  console.log("yes");
  client.user.setActivity("S̴̱̾ĺ̶ͅa̴͔̍v̶̦͛i̸̯͒n̸̜̏g̵̀͜ ̴̙͊o̶͉͒f̷̰̽f̸͍̑ ̵̦̂ḯ̷͕n̵̢̎ ̷̺͘W̶̮̅í̶̺l̸̙̎l̶̳̈y̶̞̏'̸͓̃s̴͙̄ ̸̡̅ḃ̴̤ȃ̷̯s̶͍͑e̷͔̓m̵̟̏e̶͇͝n̵͉̔t̵̛͜");
});

client.on("messageDelete", message => {
  fs.writeFile("./log.txt", message.cleanContent, function(err) {
    if (err) console.err(err);
  });
});

client.on("message", async message => {
  if (message.author.bot) return;

  if (
    (message.channel.type == "text" &&
      message.channel.name.toLowerCase() == "ideas") ||
    message.channel.name.toLowerCase() == "programming-ideas" ||
    message.channel.name.toLowerCase() == "design-ideas"
  ) {
    message.react("✅");
    message.react("❌");
  }

  if (!message.content.startsWith(config.prefix)) return;
  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "remind") {
    const args = message.content.split(" ").slice(1);

    if (args.includes("@everyone")) return message.channel.send(" **Error**");

    if (args.includes("@here")) return message.channel.send(" **Error** ");

    if (!args[0]) {
      return message.channel.send(
        "Please supply a time and message EX:``h!remind <TIME> <MESSAGE>``"
      );
    }

    if (args[0] <= 0) {
      return message.channel.send(
        "Please supply a time and message EX:``h!remind <TIME> <MESSAGE>``"
      );
    }

    let Timer = args[0];

    message.channel.send(
      "**Reminder Has Been Set For: **``" + ms(ms(Timer)) + "``"
    );

    setTimeout(function() {
      const embed = new Discord.MessageEmbed()
        .setAuthor("Time Is Up", message.author.displayAvatarURL)
        .setColor("53380")
        .addField("User: ", message.author)
        .addField("Reminder From: ", ms(ms(Timer)))
        .addField("Your Message: ", args.splice(1).join(" "))
        .setTimestamp();
      message.channel
        .send("<@" + message.author + ">" + " **Your Reminder**...")
        .catch();
      message.channel.send(embed);
    }, ms(Timer));
  }
  if (command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(
      `Pong! Latency is ${m.createdTimestamp -
        message.createdTimestamp}ms. API Latency is ${Math.round(
        client.ws.ping
      )}ms`
    );
  }

  if (command === "l.poll") {
    var argText = args.join(" ").split("|");

    const emojiArray = [
      "🇦",
      "🇧",
      "🇨",
      "🇩",
      "🇪",
      "🇫",
      "🇬",
      "🇭",
      "🇮",
      "🇯",
      "🇰",
      "🇱",
      "🇲",
      "🇳",
      "🇴",
      "🇵",
      "🇶",
      "🇷",
      "🇸",
      "🇹",
      "🇺",
      "🇻",
      "🇼",
      "🇽",
      "🇾",
      "🇿"
    ];

    const com = args.shift().toLowerCase();
    if (argText[0] == "help") {
      message.channel.send(
        "```Format:\nh!poll title of poll|time(optional)|time in minutes(optional)|option 1|option 2 | etc... \n" +
          "Example:\nh!poll Yes or no?|time|3|Yes, of course|no \n" +
          " or with default time of 360 min \nh!poll Yes or no?|Yes, of course|no ```"
      );
    }

    var title = argText[0];
    const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

    //function to send the message instead of repeating it 2 times
    function sendMSG(time) {
      //variable for counting how many options are out
      var outCount = [];
      //combines votes and options
      var combined = [];

      //time in minutes for vote time
      realTime = time * 1000 * 60;

      //send message with time and the output gathered from down below
      message.channel.send(
        "__**" +
          title +
          "**__ " +
          "\n" +
          out.join("") +
          "Time left: " +
          realTime / (1000 * 60) +
          " minutes"
      );
      const embed = new Discord.MessageEmbed()
        .setAuthor(`Poll by ${message.author.tag}`)
        .setColor("53380")
        .addField(`Poll topic:`, title)
        .addField(`Poll options:`, out.join(""))
        .addField("Poll time limit", `${realTime / (1000 * 60)} minutes`);
      message.channel
        .send(embed)
        //react and delete new messages
        .then(newMessage => {
          for (let k = 0; k < out.length; k++) {
            setTimeout(() => {
              newMessage.react(emojiArray[k]);
              outCount[k] = 1;
            }, 1000 * k);
          }

          //after vote time period, counts votes and displays them
          setTimeout(() => {
            //counts amount of emojis and adds them to the combined array
            for (let index = 0; index < out.length; index++) {
              outCount[index] =
                newMessage.reactions.find(
                  reaction => reaction.emoji.name === emojiArray[index]
                ).count - 1;
              combined[index] =
                out[index].split("\n").join("") + ": " + outCount[index] + "\n";
            }

            //gets the maximum value in the array
            let x = Math.max(...outCount);
            console.log(x);

            //checks which ones have the max value and adds styling to it
            for (let s = 0; s < outCount.length; s++) {
              if (outCount[s] == x) {
                //combined[s] = emojiArray[s] + combined[s].split("A").join("")
                combined[s] =
                  "***" + combined[s].split("\n").join("") + "***" + "\n";
              } else {
                combined[s] =
                  "~~" + combined[s].split("\n").join("") + "~~" + "\n";
              }
            }

            //deletes message and sends the results after the vote time
            newMessage.delete();
            message.channel.send(
              "__**The results of " + title + "**__ " + "\n" + combined.join("")
            );
          }, realTime);
        });
    }

    if (argText[1]) {
      if (argText[1].trim() == "time") {
        //output if time is selected
        var out = [];
        for (let i = 2; i < argText.slice(1).length; i++) {
          out[i - 2] =
            "__" + alphabet[i - 2] + ") " + "__" + argText[i + 1] + "\n";
        }
        sendMSG(argText[2].split('"'));
      } else {
        //output if no time is set
        var out = [];
        for (let i = 0; i < argText.slice(1).length; i++) {
          out[i] = "__" + alphabet[i] + ") " + "__" + argText[i + 1] + "\n";
        }
        sendMSG(360);
      }
    }
  }

  if (command === "poll") {
    let poll = message.content.replace("h!poll ", "");
    const embed = new Discord.MessageEmbed()
      .setAuthor(`Poll by ${message.author}`)
      .setColor("53380")
      .addField(`Poll topic:`)
      .addField(poll);
    message.channel.send(embed).then(msg => {
      msg.react("👍");
      msg.react("➖");
      msg.react("👎");
    });
  }

  if (command === "rst") {
    const args = message.content.split(" ").slice(1);
    if (args < "WEREALLGAYDOWNHERE")
      return message.channel.send("Wrong password, try again...");
    let Bot = message.client;
    message.channel.send("Restart has been initiated.\n**Restarting...**");
    setTimeout(function() {
      Bot.destroy();
    }, 1000);
    setTimeout(function() {
      process.exit();
    }, 2000);
    setTimeout(function() {
      Bot.login(process.env.TOKEN).catch(console.error);
    }, 3000);
    message.delete();
  }

  if (command === "forceshutdown") {
    const args = message.content.split(" ").slice(1);
    if (args < "SOMEONEFUCKEDITUPAGAIN")
      return message.channel.send("Wrong password, try again...");
    message.channel.send("Forcing a shutdown, cya in the next life :'('");
    message.delete();
    let Bot = message.client;
    while (1 === 1) Bot.destroy();
  }

  if (command === "choose") {
    const args = message.content.split(" ");
    if (args.length < 2)
      return message.channel.send("Please send more than 2 arguments");
    let choices = message.content
      .replace("h!choose ", "")
      .replace(/or /g, "")
      .replace(/of /g, "")
      .split(" ");
    let choce = Math.floor(Math.random() * choices.length);
    message.channel.send(`${choices[choce]}, I choose you!`);
  }

  if (command === "rate") {
    let ratus =
      message.mentions.members.first() || message.mentions.channels.first();
    if (!ratus)
      return message.channel.send("Mention someone or a channel to rate them!");

    let rates = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];

    let rate = Math.floor(Math.random() * rates.length);

    let embed = new Discord.MessageEmbed()
      .setColor("53380")
      .addField("User/channel: ", ratus)
      .addField("Rating", "" + rate + "/10");
    message.channel.send(embed);
  }

  if (command === "lmgtfy") {
    message.channel.send(
      `https://lmgtfy.com/?q=${message.content
        .split("lmgtfy ")[1]
        .replace(/ /g, "+")}&iie=1`
    );
  }
  if (command === "meme") {
    (async () => {
      got("https://www.reddit.com/r/dankmemes/random/.json").then(response => {
        let content = JSON.parse(response.body);
        let permalink = content[0].data.children[0].data.permalink;
        let memeUrl = `https://reddit.com${permalink}`;
        let memeImage = content[0].data.children[0].data.url;
        let memeTitle = content[0].data.children[0].data.title;
        let memeUpvotes = content[0].data.children[0].data.ups;
        let memeDownvotes = content[0].data.children[0].data.downs;
        let memeNumComments = content[0].data.children[0].data.num_comments;
        let embed = new Discord.MessageEmbed()
          .addField(memeUrl, memeTitle)
          .setColor("53380")
          .setImage(memeImage)
          .setFooter(`Upvotes ${memeUpvotes} Downvotes ${memeDownvotes}`);

        message.channel.send(embed);
      });
    })().catch(err => {
      console.err(err);
    });
  }

  if (command === "colorscheme") {
    console.log("hmmmmmmeys");
    const type = args[0];
    console.log(type);
    const firstColor = args[1];
    console.log(`${firstColor}`);
    var hueColor = hsl(`${firstColor}`)[0];
    var scheme = new ColorScheme();

    scheme.from_hue(hueColor);
    scheme.scheme(type);
    scheme.add_complement(true);
    scheme.variation("hard");
    message.channel.send(`\`\`\`${scheme.colors()}\`\`\``);
  }

  if (command === "snipe") {
    const fetchedLogs = await message.guild.fetchAuditLogs({
      type: "MESSAGE_DELETE"
    });
    message.channel.send(fetchedLogs);
  }

  if (command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o => {});
    message.channel.send(sayMessage);
  }
});

client.login(process.env.TOKEN);
