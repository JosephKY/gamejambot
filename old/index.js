const Discord = require("discord.js")
const { Intents, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js")
const fs = require('fs')
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const { MessageAttachment, MessageEmbed } = require('discord.js')

const prefix = '.'
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))

client.on('ready', () => {
  console.log('The bot is ready')
  
  const guild = client.guilds.cache.get('720636351338250401')
  let commands
  
  if (guild) {
    commands = guild.commands
  } else {
    commands = client.application.commands
  }
  
  commands.create({
    name: 'apply',
    description: 'Submit a skill rank application.',
    options: [
      {
        name: 'skill',
        description: 'The skill you want to apply for.',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        choices: [
          { name: '📝 Scripter', value: 'scripter' }, { name: '🔨 Builder', value: 'builder' }, { name: '🍩 3D Modeler', value: '3d modeler' }, { name: '📱 GUI', value: 'gui' }, { name: '🏃 Animator', value: 'animator' }, { name: '🎨 GFX', value: 'gfx' }, { name: '🎹 SFX', value: 'sfx' }, { name: '✨ Effects', value: 'effects' }, { name: '👕 Clothing', value: 'clothing' }
        ]
      }
    ]
  })
  
  commands.create({
    name: 'post',
    description: 'Create a marketplace post.',
  })
})






client.on('interactionCreate', async (interaction) => {
  const { commandName, options } = interaction
  //const collector = interaction.channel.createMessageComponentCollector()
  
  const navRow = new MessageActionRow()
   .addComponents(
     new MessageButton()
     .setLabel('cancel')
     .setStyle('SECONDARY')
     .setEmoji('❌')
   )
   .addComponents(
     new MessageButton()
     .setLabel('restart')
     .setStyle('SECONDARY')
     .setEmoji('🔁')
   )
  
  if (commandName === 'post') {
    if (interaction.member.roles.cache.has('720636351338250408')) {
      const typeRow = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
        .setCustomId('typeMenu')
        .setPlaceholder('Select a type...')
        .addOptions([{ label: '📣 Advertising', description: `"I want to promote something."`, value: 'advertising' }, { label: '💰 Selling Assets', description: `"I want to sell my models or products."`, value: 'selling' }, { label: '💵 Hiring', description: `"I want to hire someone."`, value: 'hiring' }, { label: '👷 For Hire', description: `"I want to be hired."`, value: 'for hire' }])
      )

      let url = await interaction.member.send({
        content: `👋 Hello! What type of post do you want to create?`,
        components: [typeRow]
      }).then(m => m.url)

      //❌ Couldn't DM you.\nPlease go to **User Settings** -> **Privacy & Safety** -> **Allow direct messages from server members**

      const dmRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setLabel('Go to DMs')
        .setStyle('LINK')
        .setURL(url)
      )
      
      interaction.reply({
        content: '✅ Ready to create a post in your DMs!',
        components: [dmRow],
        ephemeral: true
      })
    } else {
      interaction.reply({
        content: '❌ You need to be **Level 5** to post. Chat to level up. Check your rank by using `!rank` in <#448991078197231630>.',
        ephemeral: true
      })
    }
  }
  
  
  
  if (interaction.customId === 'typeMenu') {
    const adRow = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setLabel('Go to #📣advertising')
      .setStyle('LINK')
      .setURL('https://discord.com/channels/448986884497211392/448989837505200129')
    )
    
    
    // let dmUserId = interaction.user.id
    // let dmUser = client.users.cache.get(dmUserId)
    let dmMes = await interaction.channel.messages.fetch().then(all => all.filter(all2 => all2.author.id === client.id).first())
    
    if (interaction.values[0] === 'advertising') {
       dmMes.send({
         content: `You can send this post yourself! Go to <#448989837505200129> to post.`,
         components: [adRow]
       })
    }
  }

  
  
    let fetchChannel = client.channels.cache.get('756900485155389512')
    let m = await fetchChannel.messages.fetch().then(all => all.filter(all2 => all2.author.id === interaction.member.id))

   ////funct
  
   function opArrayFunct() {
     let opArrayRes = []

     for (var i = 0; i < m.size; i++) {
       function mesArrayFunct() {
         let mes = m.at(i)

         function field(tag) {
           if (mes.content.includes(tag)) {
             let res = mes.content.split(tag).pop().split('\n').shift()
             if (res.length > 59) {
               let resSlice = res.slice(0, 60) + '...'
               return resSlice
             } else return res
           } else return mes.content.slice(0, 60) + '...'
         }

         let date = new Date(mes.createdTimestamp)
         let timestamp = `${date.toString().split(' ')[1]} ${date.toString().split(' ')[2]}, ${date.toString().split(' ')[3]}`

         function mesDescFunct() {
           let noReactions = `${timestamp}`
         if (mes.reactions.cache.has('829996643063169024' || '829996653188612096')) {
           let mesDesc = `${timestamp} 👍 ${mes.reactions.cache.get('829996643063169024').count - 1} 👎 ${mes.reactions.cache.get('829996653188612096').count - 1}`
           return mesDesc
           } else return noReactions
         }

         let mesName = field('Name: ')
         let mesDesc = mesDescFunct()
         let mesVal = `${mes.id}${i}`

         let mesArrayRes = { label: mesName, description: mesDesc, value: mesVal }
         return mesArrayRes
       }

       let mesArray = mesArrayFunct()
       opArrayRes[i] = mesArray
     }
     return opArrayRes
   }
  
  
  
   let opArray = opArrayFunct()
   let applyCont = 'Use the dropdown to view your posts from <#756924086659055817>.\nSelect "Hide this post" to exclude the selected post from your final application.'

  
   if (commandName === 'apply') {
     let fetchChannel = client.channels.cache.get('756900485155389512')
     let m = await fetchChannel.messages.fetch().then(all => all.filter(all2 => all2.author.id === interaction.member.id))
        
     const row = new MessageActionRow()
     .addComponents(
       new MessageSelectMenu()
       .setCustomId('select')
       .setPlaceholder('Select a post...')
       .addOptions(opArray)
     )
    
     const row2 = new MessageActionRow()
     .addComponents(
       new MessageButton()
       .setCustomId('hide')
       .setLabel('Hide this post')
       .setStyle('SECONDARY')
     )
     .addComponents(
       new MessageButton()
       .setCustomId('submit')
       .setLabel('Submit')
       .setStyle('PRIMARY')
     )
        
     interaction.reply({
       content: applyCont,
       components: [row, row2],
       ephemeral: true
     })
   }
  
  
  
   if (interaction.customId === 'select') {
     let mesId = interaction.values[0].slice(0, -1)
     let mes = await interaction.member.guild.channels.cache.get('756900485155389512').messages.fetch().then(all => all.filter(all2 => all2.author.id === interaction.member.id).get(mesId))
    
     let opIndex = interaction.values[0].slice(-1)
    
     const row = interaction.message.components[0]
    
     const row2 = new MessageActionRow()
     .addComponents(
       new MessageButton()
       .setCustomId(`hide${opIndex}`)
       .setLabel('Hide this post')
       .setStyle('SECONDARY')
     )
     .addComponents(
       new MessageButton()
       .setCustomId('submit')
       .setLabel('Submit')
       .setStyle('PRIMARY')
     )

     function opAttFunct() {
       let a = mes.attachments
       let opAttRes = []

       for (var i = 0; i < a.size; i++) {
         let att = a.at(i).url
         //let file = new MessageAttachment(att)
         opAttRes[i] = att
       }
       return opAttRes.join('\n')
     }
    
     let opAttArray = opAttFunct()

     let applyCont2 = `${applyCont}\n\n[────── Selected Post ──────](${mes.url})\n${mes.content}\n\n${opAttArray}`
    
     //let file = new MessageAttachment(mes.attachments.at(0).url)
    
     await interaction.update({
       content: applyCont2,
       components: [row, row2],
       //files: [file]
     })
   }
  
  
  
  
   if (interaction.customId.startsWith('hide')) {
     console.log(interaction.message.attachments)
     let opIndex = interaction.message.components[1].components[0].customId.slice(-1)
     let newOpArray = interaction.message.components[0].components[0].options
     newOpArray.splice(opIndex, 1)
    
     function newOpArrayFunct() {
       let o = newOpArray
       let newOpArrayRes = []

       for (var i = 0; i < o.length; i++) {
         function opArrayFunct() {
           let op = o[i]

           let opName = op.label
           let opDesc = op.description
           let opVal = `${op.value.slice(0, -1)}${i}`
          
          
           let opArrayRes = { label: opName, description: opDesc, value: opVal }
           return opArrayRes
         }

         let opArray = opArrayFunct()
         newOpArrayRes[i] = opArray
       }
       return newOpArrayRes
     }
    
     newOpArray = newOpArrayFunct()
    
     const row = new MessageActionRow()
     .addComponents(
       new MessageSelectMenu()
       .setCustomId('select')
       .setPlaceholder('Select a post...')
       .addOptions(newOpArray)
     )
    
     const row2 = interaction.message.components[1]
    
     await interaction.update({
       content: applyCont,
       components: [row, row2]
     })
   }
})
    
    
    

client.on('messageCreate', async (message) => {
  
  
  
  if (message.content === 'c') {
    let mesAtt = await message.attachments.fetch().then(all => all.each(att => att.url))
    message.channel.send(mesAtt, { attachments: mesAtt }).then(me => console.log(me))
    return
  }
  
  if (message.content === 'f') {
    let fetchChannel = client.channels.cache.get('756900485155389512')
    
    fetchChannel.messages.fetch()
      .then(messages => messages.filter(m => m.author.id === message.author.id).each(mes => mes.attachments.each(att => setTimeout(() => message.channel.send(att.url), 2000))))
    return
  }
  
  if (!message.content.startsWith(prefix) || message.author.bot) return
  const args = message.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()
  
  ////////// COMMAND HANDLER //////////
  
  switch (command) {
    case 'ping':
      client.commands.get('ping').execute(message, args)
      break
    case 'ping2':
      client.commands.get('ping2').execute(message, args)
      break
  }
})

client.login(process.env.TOKEN)