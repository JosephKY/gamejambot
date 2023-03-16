const Discord = require("discord.js")
const { Intents } = require("discord.js")
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS]})
const TOKEN = process.env.TOKEN
const db = require("quick.db")
const axios = require("axios")

client.on('ready', () => {
  const guildId = '706528265908518962'
  const guild = client.guilds.cache.get(guildId)
  let commands

  if (guild) {
    commands = guild.commands
  } else {
    commands = client.application?.commands
  }

  commands?.create({
    name: 'ping',
    description: 'replies with pong'
  })
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }
  
  const { commandName, option } = interaction
  if (commandName === 'ping') {
    interaction.guild.channels.cache.get('756900485155389512').messages.fetch()
      .then(messages => messages.filter(m => m.author.id === interaction.member.id).first().delete())
    interaction.reply({
      content: 'Found your submission! Handing it over to the mods...',
      ephemeral: true //t = no one can see, f = everyone can see
    })
  }
})


client.on('messageCreate', async message => {
  if (message.author.client) return
  
  if (message.content.toLowerCase() === '.app') {
    message.channel.send('✅ Check your DMs!')
    db.delete(`appDM_${message.author.id}`)
    db.delete(`appST_${message.author.id}`)
    let embed = new Discord.MessageEmbed().setColor('#34a7e9').setTitle('**What skill are you applying for?**').setDescription('───────────────────\n📝 - Scripter\n🔨 - Builder\n🍩 - Mesh\n📱 - GUI\n🏃 - Animator\n🎨 - GFX\n🎹 - SFX\n✨ - Effects\n👚 - Clothing').setFooter('Expires in 1 minute.')
    let embed2 = new Discord.MessageEmbed().setColor('#34a7e9').setTitle('**Please __link__ the best examples of your work.**').setDescription('───────────────────\nSend all image, game, or ghostbin links in one message separated by spaces.\nDevForum portfolios are welcome!\n───────────────────\n`Rank [I]` - Shows the very basics.\n`Rank [II]` - Shows a better understanding and some skillful touches. **__2__ separate works required.**\n`Rank [III]` - Work is much more clean and unique. Shows solid understanding and application of the skill. **__3__ separate works required.**\n`Rank [★]` - Demonstrates mastery and the best qualities of the skill. Understands the skill fully on both a theoretical and practical level. Sets an inspiring example for other members. **__4__ separate works required.**\n[Extended Info](https://app.skiff.org/docs/a3218533-f305-4cb4-881b-8d9c1c66fc6e#sFXVJhrYblKOEvEfPfZ4NmLlSJsyfanK7nMOL7JIass=)').setFooter('Expires in 5 minutes. Say "cancel" to cancel this app.')
    let embed3 = '❌ Cancelled.'
    let embed4 = '✅ Submitted!\n*Say ".app" to apply for another skill.*'
    let filter = m => m.author.id === message.author.id
    let filter2 = (reaction, user) => user.id === message.author.id
    message.author.send(embed).then (m => db.set(`appDM_${message.author.id}`, `${m.channel.id}`) && m.react('📝') && m.react('🔨') && m.react('🍩') && m.react('📱') && m.react('🏃') && m.react('🎨') && m.react('🎹') && m.react('✨') && m.react('👚') && m.awaitReactions(filter2, { max: 1, time: 60000}).then (collected => {
      let ans = collected.first().emoji.name
      message.author.send(embed2).then (m => m.channel.awaitMessages(filter, { max: 1, time: 300000}).then(collected => {
        if (collected.first().content.toLowerCase() === 'cancel') {
            return message.author.send(embed3)
          }
        let links = collected.first().content
        let rgx = /\📝/g
        let rgx2 = /\🔨/g
        let rgx3 = /\🍩/g
        let rgx4 = /\📱/g
        let rgx5 = /\🏃/g
        let rgx6 = /\🎨/g
        let rgx7 = /\🎹/g
        let rgx8 = /\✨/g
        let rgx9 = /\👚/g
        let skill = ans.replace(rgx, 'Scripter').replace(rgx2, 'Builder').replace(rgx3, 'Mesh').replace(rgx4, 'GUI').replace(rgx5, 'Animation').replace(rgx6, 'GFX').replace(rgx7, 'SFX').replace(rgx8, 'Effects').replace(rgx9, 'Clothing')
        let id = message.author.id
        axios.get(`https://api.blox.link/v1/user/${id}`)
          .then (res => {
            let robloxid = res.data.primaryAccount
            axios.get(`https://api.roblox.com/users/${robloxid}`)
              .then (res2 => {
                let robloxuser = res2.data.Username
                let embed4 = new Discord.MessageEmbed().setColor('#2f3136').setTitle(`${ans} **${skill} Application**`).setDescription(links).addField('Roblox', `[Profile](https://www.roblox.com/users/${robloxid}/profile) | ${robloxuser} | ${robloxid}`, true).addField('Discord', `[Profile](https://www.discord.com/users/${id}) | ${id}`, true)
                client.channels.cache.get('843635536409395250').send(embed4)
            })
        })
      }))
    }))
  }
  
  if (message.content.toLowerCase() === '.ad') {
    message.channel.send('✅ Check your DMs!')
    db.delete(`adDM_${message.author.id}`)
    db.delete(`adST_${message.author.id}`)
    let uid = message.author.id
    let line = '<:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140>:blue_square:<:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140>'
    let line2 = '<:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140><:rscline2:842518191540142140>'
    let embed = new Discord.MessageEmbed().setColor('#34a7e9').setTitle('**What kind of ad are you posting?**').setDescription('📣 - Advertising\n💰 - Selling Assets\n✅ - Looking To Hire\n👷 - Looking To Be Hired').setFooter('Expires in 1 minute.')
    let embedA1 = new Discord.MessageEmbed().setColor('#34a7e9').setTitle('**What is the description of your ad?**').setDescription(`Dont add social links or images yet.`).setFooter('Expires in 3 minutes. Say "cancel" to cancel this ad.')
    let embedA2 = new Discord.MessageEmbed().setColor('#34a7e9').setTitle('**Paste your SOCIAL links.**').setDescription('Add only a space between each.\nSay "skip" if you dont want to include any images.').setFooter('Expires in 3 minutes. Say "cancel" to cancel this ad.')
    let embedA3 = new Discord.MessageEmbed().setColor('#34a7e9').setTitle('**Paste your IMAGE links.**').setDescription('You can only post up to 2 image links.\nSay "skip" if you dont want to include any links.').setFooter('Expires in 3 minutes. Say "cancel" to cancel this ad.')
    let embed2 = new Discord.MessageEmbed().setColor('#34a7e9').setTitle('**Here is your ad.**').setDescription('React with ✅ to submit your ad for review or ❌ to cancel this ad. Say ".ad" to try again.').setFooter('Expires in 3 minutes.')
    let embed3 = '❌ Cancelled.'
    let embed4 = '✅ Submitted!'
    ///
    let filter = m => m.author.id === message.author.id
    let filter2 = (reaction, user) => user.id === message.author.id
    message.author.send(embed).then (m => db.set(`adDM_${message.author.id}`, `${m.channel.id}`) && m.react('📣') && m.react('💰') && m.react('✅') && m.react('👷') && m.awaitReactions(filter2, { max: 1, time: 60000}).then (collected => {
      
      if (collected.first().emoji.name === '📣') {
        message.author.send(embedA1).then (m => m.channel.awaitMessages(filter, { max: 1, time: 180000}).then(collected => {
          if (collected.first().content.toLowerCase() === 'cancel') {
            return message.author.send(embed3)
          }
          let adDesc = collected.first().content
          message.author.send(embedA3).then (m => m.channel.awaitMessages(filter, { max: 1, time: 180000}).then(collected => {
            if (collected.first().content.toLowerCase() === 'cancel') {
              return message.author.send(embed3)
            }
            let adImage = collected.first().content
            let setup = `${line}\n👤 - <@${message.author.id}>\n${adDesc}\n${line2}\n${adImage}`
            let embed5 = new Discord.MessageEmbed().setDescription(`[Discord](${adImage})`)
            message.author.send(setup, {embed: embed5})
            message.author.send(embed2).then (m => m.react('✅') && m.react('❌') && m.awaitReactions(filter2, { max: 1, time: 60000}).then (collected => {
              if (collected.first().emoji.name === '❌') {
                return message.author.send(embed3)
              }
              if (collected.first().emoji.name === '✅') {
                message.author.send(embed4)
                client.channels.cache.get('715813609338568756').send(setup)
              }
            }))
          }))
        }))
      }
      
      
    }))
    
    //client.channels.cache.get(db.get(`adDM_${message.author.id}`)).awaitMessages(filter, { max: 1, time: 10000})
      //.then (collected => {
      //console.log(collected.first().content)
      //db.delete(`adDM_${message.author.id}`)
    //})
  }
  
  if (message.channel.id === '730165966297628765') {
    let id = message.content.split(' ')[0]
    let desc = message.content.split(' ').slice(1).join(' ')
    axios.get(`https://api.blox.link/v1/user/${id}`)
      .then (res => {
        let robloxid = res.data.primaryAccount
        axios.get(`https://api.roblox.com/users/${robloxid}`)
          .then (res2 => {
            let robloxuser = res2.data.Username
            let embed = new Discord.MessageEmbed().setColor('#2f3136').setTitle('Scam').setDescription(desc).addField('Roblox', `[Profile](https://www.roblox.com/users/${robloxid}/profile) | ${robloxuser} | ${robloxid}`, true).addField('Discord', `[Profile](https://www.discord.com/users/${id}) | ${id}`, true)
            message.delete()
            message.channel.send(embed)
        })
    })
  }
})

//////TEST NEW STUFFFFF//////
client.on('messageCreate', message => {
  
  if (message.content.toLowerCase().startsWith('.rule')) {
    message.channel.send(db.get(`rule${message.content.slice(6)}`))
  }
  
  if (message.content.toLowerCase().startsWith('.editrule')) {
    if (message.author.id === '293524146879463425' || '331048169179709440') {
      db.set(`rule${message.content.split(' ')[1]}`, message.content.split(' ').slice(2).join(' '))
      message.channel.send(`:white_check_mark: Changed Rule ${message.content.split(' ')[1]} to ${message.content.split(' ').slice(2).join(' ')}`)
    }
  }
  
  if (message.content.toLowerCase().startsWith('.editref')) {
    if (message.author.id === '293524146879463425' || '331048169179709440') {
      db.set(`ref${message.content.split(' ')[1]}`, message.content.split(' ').slice(2).join(' '))
      message.channel.send(`:white_check_mark: Changed Reference ${message.content.split(' ')[1]} to ${message.content.split(' ').slice(2).join(' ')}`)
    }
  }
  
  if (message.content === 'inre') {
    if (message.channel.id === '843635536409395250') {
      let rules = `*(Not reading the rules can get you warned.)*\n\n:red_square: = **Ban**\n:white_large_square: = **Warn**\n:blue_square: = **Mute**\n:purple_square: = **Channel suspension** (If continued)\n\n${db.get('rule1')}\n${db.get('rule2')}\n${db.get('rule3')}\n${db.get('rule4')}\n${db.get('rule5')}\n${db.get('rule6')}\n${db.get('rule7')}\n${db.get('rule8')}\n${db.get('rule9')}\n${db.get('rule10')}\n${db.get('rule11')}\n${db.get('rule12')}\n${db.get('rule13')}\n${db.get('rule14')}\n${db.get('rule15')}\n${db.get('rule16')}\n${db.get('rule17')}\n\n**Follow the Discord ToS**\n*(Joking about being underage will get you banned.)*`
      let rgx = /\[Ban]/g
      let rgx2 = /\[Warn]/g
      let rgx3 = /\[Mute]/g
      let rgx4 = /\[Channel suspension]/g
      let info = rules.replace(rgx, '🟥').replace(rgx2, '⬜').replace(rgx3, '🟦').replace(rgx4, '🟪')
      let info2 = `───────────────────\n**References**\n**[1]** ${db.get('ref1')}\n**[2]** ${db.get('ref2')}\n**[3]** ${db.get('ref3')}\n\n───────────────────\n<:rS:848009471795658752><:rK:848009487218638858><:rI:848009505119535114><:rL:848009441232289842><:rL:848009441232289842>    <:rR:848007553745289236><:rA:848009522759991296><:rN:848009536933855262><:rK:848009487218638858><:rS:848009471795658752>\n\nPost your creation in the correct creations channel. e.g. <#449312743116505101>, <#448989787680931852>.\nWait until a staff member ranks you, or ping a Moderator with the <@&696049352224800844> role.\n*(^ Make sure they have the correct role e.g Scripter, Builder. And Only ping 1 Moderator.)*\n\n───────────────────\n<:rS:848009471795658752><:rU:848007569741971502><:rP:848009551567388682><:rP:848009551567388682><:rO:848009564452683799><:rR:848007553745289236><:rT:848009577697771530>\n\nTo receive support, please look in the <#813074276538253332> channel.\nTry not to DM staff members.\nDM Higher up if a staff member is abusive.\n\n───────────────────\n<:rL:848009441232289842><:rI:848009505119535114><:rN:848009536933855262><:rK:848009487218638858><:rS:848009471795658752>\n\nDiscord: https://discord.gg/robloxstudio\nRoblox: https://roblox.com/groups/4710088/RSC-Roblox-Studio-Community\nTwitter: https://twitter.com/rscdiscord\nPatreon: https://patreon.com/rscdc\n\nBan appeal form: https://rsc.gg/appeal\nApplication form: https://rsc.gg/application`
      let info3 = `───────────────────\n**Self-Assignable Roles**\n:bell: - Partner Notifications\n:mega: - Roblox News\n:gem: - Minecraft Server\n:construction_worker: - For Hire\n:x: - Not For Hire\n:two: - 2D Artist\n:three: - 3D Artist`
      message.delete()
      message.channel.send('https://cdn.discordapp.com/attachments/843635536409395250/848002430477795328/imageedit_7_2241530289.png')
      message.channel.send('<:rR:848007553745289236><:rU:848007569741971502><:rL:848009441232289842><:rE:848009457266982932><:rS:848009471795658752>')
      message.channel.send(info)
      message.channel.send(info2)
      message.channel.send(info3)
    }
  }
})

//client.login(TOKEN)