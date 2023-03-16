const Discord = require("discord.js")
const { Intents } = require("discord.js")
const fs = require('fs')
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

module.exports = {
  name: 'ping',
  description: 'replies with pong',
  execute(message, args){
    let fcChannel = client.channels.cache.get('756900485155389512')
    let posts = fcChannel.messages.fetch().then(messages => messages.filter(m => m.author.id === message.member.id)).first()
    message.channel.send(posts)
  }
}