const Discord = require("discord.js");
const {
  Intents,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  GatewayIntentBits
} = require("discord.js");

// V13
/*const client = new Discord.Client({ 
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});*/


// V14

const client = new Discord.Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

const fs = require("fs");

const { QuickDB } = require("quick.db")
let db = new QuickDB()
client.db = db

require("dotenv").config();

///Filter Categories
//const { swears, links, pings } = require("./filter.json");
///Handler Configuration
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

//let handler = ["commandhandler", "eventhandler"].forEach((handler) => {
//  require(`./handlers/${handler}`)(Discord, client, db);
//});

let handler = ["eventhandler"].forEach((handler) => {
  require(`./handlers/${handler}`)(Discord, client, db);
});

// client.on('message', message => {
//   if (message.content === 'yaba') {
//     message.channel.send('yobo')
//   }
// })

client.login(process.env.TOKEN);
