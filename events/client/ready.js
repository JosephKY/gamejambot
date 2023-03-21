//const { notes, notes1, notes2 } = require("../../notes.json")

const fs = require("fs");
const https = require("https");
const table = require("text-table");
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const config = JSON.parse(fs.readFileSync("config.json"))

module.exports = async (Discord, client) => {
  
  client.user.setPresence({ activities: [{ name: '/team help' }], status: 'online' })
  
  // START OF CONFIGURATION VARIABLES

  // If you're confused, look at README.md

  client.skillRoles = config.skillRoles;
  client.badRoles = config.badRoles;

  let guild = config.guild;

  client.jamCategory = config.jamCategory;
  client.jamBackupCategory = config.jamBackupCategory;
  client.jamModIds = config.jamModIds;
  client.jamStaffChannel = config.jamStaffChannel;
  client.jamLogId = config.jamLogId;
  client.jamRoleId = config.jamRoleId;

  client.minTeamNameLength = config.minTeamNameLength;
  client.maxTeamNameLength = config.maxTeamNameLength;
  client.maxTeammates = config.maxTeammates;
  client.maxTeams = config.maxTeams;
  
  client.swears = config.swears;

  client.strings = config.strings;

  // END OF CONFIGURATION VARIABLES

  let errorEmbedTemplate = new EmbedBuilder()
  .setColor([237, 66, 69])
  .setTitle("❌ Error")
  .setDescription("An error occurred")
  .setFooter({
    text: "Error Code -1"
  })

  client.string = function(key){
    let str = client.strings[key]
    if(!str)return "undefined"
    return str
  }

  client.errorEmbed = function(code, subcode="0"){
    let desc = client.strings.errors[code]
    let embed = errorEmbedTemplate
    if(!desc)return embed

    embed
    .setFooter({
      text:`Error Code ${code}-${subcode}`
    })
    .setDescription(desc)
    .setTimestamp();

    return embed
  }

  client.logAction = async function(user=false, description="\u200b", color=[88, 101, 242], files=[]){
    if(!user)return
    let guildObject = await client.guilds.cache.get(guild)
    if(!guildObject)return
    let logChannel = await guildObject.channels.cache.get(client.jamLogId)
    if(!logChannel)return
    logChannel.send({embeds: [
      new EmbedBuilder()
      .setTitle("\u200b")
      .setAuthor({ name: await user.tag, iconURL: await user.avatarURL()})
      .setTimestamp()
      .setColor(color)
      .setDescription(description)
      .setFooter({text:`ID: ${user.id}`})
    ], files: files})
  }

  console.log("Game Jam Bot is online!");

  let db = client.db

  client.getTeamData = async function(userId){
    return await db.get(`jamTeamData-${userId}`);
  }
  
  if (await db.get("jamGeneral") == null){
    let defaultData = {
      "jamstart":0,
      "jamend":0,
      "count":config.maxTeams
    }
    await db.set("jamGeneral",defaultData )
  }

  let guildCommands = [
    new SlashCommandBuilder()
      .setDescription("Configure your game jam team")
      .setName("team")
      .addSubcommand((helpSc) => {
        return helpSc
          .setName("help")
          .setDescription("View help and information")
          .addStringOption((option)=> {
            return option
              .setName("category")
              .setDescription("Choose what it is you need help with")
              .setRequired(true)
              .addChoices({ name:"😢 Withdrawing",value:"0" }, { name:"💔 Removing a Teammate",value:"1" }, { name:"💌 Inviting Teammates",value:"2" }, { name:"✅ Submitting Your Game",value:"3" }, { name:"✍ Personalizing Team",value:"4" }, { name:"👑 Leadership",value:"5" })
        })
      })
      .addSubcommand((summarySc) => {
        return summarySc
          .setName("summary")
          .setDescription("View a summary of the team that you're in")
      })
      .addSubcommand((inviteSc) => {
        return inviteSc
          .setName("invite")
          .setDescription("Invite someone to join your team")
          .addUserOption((option) => {
            return option
              .setName("member")
              .setDescription("The member you want to invite")
              .setRequired(true);
          });
      })
      .addSubcommand((nameSc) => {
        return nameSc
          .setName("name")
          .setDescription("Set your team name")
          .addStringOption((option) => {
            return option
              .setName("name")
              .setDescription("The name you want for your team")
              .setRequired(true);
          });
      })
      .addSubcommand((gameSc) => {
        return gameSc
          .setName("game")
          .setDescription("Set the team's Roblox experience URL")
          .addStringOption((option) => {
            return option
              .setName("url")
              .setDescription(
                "The URL for the Roblox experience for your project"
              )
              .setRequired(true);
          });
      }),
          
      //}),    
      //.addSubcommand((transferSc) => {
      //  return transferSc
      //    .setName("transfer")
      //    .setDescription("Transfer team leadership to another teammate")
      //    .addUserOption((option) => {
      //      return option
      //        .setName("teammate")
      //        .setDescription("The teammate you want to transfer leadership to")
      //        .setRequired(true);
      //    });
      //}),

    new SlashCommandBuilder()
      .setName("teammod")
      .setDescription("Moderator-only team commands")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addSubcommand((userSc) => {
        return userSc
          .setName("user")
          .setDescription("View team data for a user")
          .addUserOption((option) => {
            return option
              .setName("user")
              .setDescription("The user you want to inspect")
              .setRequired(true);
          })
      })
      .addSubcommand((archiveSc) => {
        return archiveSc
          .setName("archive")
          .setDescription("Archive a team channel into a JSON file")
          .addUserOption((option) => {
            return option
              .setName("user")
              .setDescription("A member of the team who's channel is being archived")
              .setRequired(true);
          })
      })
      .addSubcommand((forcenameSc) => {
        return forcenameSc
          .setName("forcename")
          .setDescription("Force a team name change")
          .addUserOption((option) => {
            return option
              .setName("leader")
              .setDescription("The team leader of the team")
              .setRequired(true);
          })
          .addStringOption((option) => {
            return option
              .setName("name")
              .setDescription("The new name for the team")
              .setRequired(true);
          });
      })
      .addSubcommand((removeSc) => {
        return removeSc
          .setName("remove")
          .setDescription("Remove a teammate from a team")
          .addUserOption((option) => {
            return option
              .setName("leader")
              .setDescription("The team leader of the team")
              .setRequired(true);
          })
          .addUserOption((option) => {
            return option
              .setName("teammate")
              .setDescription("The teammate that is being removed")
              .setRequired(true);
          });
      })
      .addSubcommand((deleteSc) => {
        return deleteSc
          .setName("delete")
          .setDescription("Delete a team permanently")
          .addUserOption((option) => {
            return option
              .setName("leader")
              .setDescription(
                "The team leader of the team that is being deleted"
              )
              .setRequired(true);
          });
      })
      .addSubcommand((deposeSc) => {
        return deposeSc
          .setName("depose")
          .setDescription("Force team leadership transfer to another teammate")
          .addUserOption((option) => {
            return option
              .setName("leader")
              .setDescription("The team leader that is being deposed")
              .setRequired(true);
          })
          .addUserOption((option) => {
            return option
              .setName("teammate")
              .setDescription("The teammate that is replacing the current leader")
              .setRequired(true);
          });
      })
      .addSubcommand((debugSc) => {
        return debugSc
          .setName("team")
          .setDescription("View all data for a team")
          .addUserOption((option) => {
            return option
              .setName("leader")
              .setDescription("The team leader of the team that is being inspected")
              .setRequired(true);
          });
      })
      .addSubcommand((addteamSc) => {
        return addteamSc
          .setName("addteam")
          .setDescription("Forcefully create a team")
          .addUserOption((option) => {
            return option
              .setName("leader")
              .setDescription("The team leader of the new team")
              .setRequired(true);
          });
      })
      .addSubcommand((addmateSc) => {
        return addmateSc
          .setName("addmate")
          .setDescription("Forcefully adds a teammate")
          .addUserOption((option) => {
            return option
              .setName("leader")
              .setDescription("The team leader of the team getting a new teammate")
              .setRequired(true);
          })
          .addUserOption((option) => {
            return option
              .setName("teammate")
              .setDescription("The server member being forcefully added to the team")
              .setRequired(true);
          });
      })
      .addSubcommand((resetInv) => {
        return resetInv
          .setName("resetinv")
          .setDescription("Reset team invites. Note this will make all current invites in that team invalid")
          .addUserOption((option) => {
            return option
              .setName("leader")
              .setDescription("The team leader of the team that is having their invites reset")
              .setRequired(true);
          });
      })
      .addSubcommand((deploySc) => {
        return deploySc
          .setName("deploy")
          .setDescription("Deploy the game jam interface")
          .addStringOption((option) => {
            return option
              .setName("title")
              .setDescription("The title of the interface")
              .setRequired(true);
          })
          .addStringOption((option) => {
            return option
              .setName("description")
              .setDescription("The description of the interface")
              .setRequired(true);
          })
      })
        .addSubcommand(jamstart=>{
          return jamstart
          .setName("jamstart")
          .setDescription("Set the time the jam starts")
          .addIntegerOption((option) => {
            return option
              .setName("time")
              .setDescription("The time the jam starts in milliseconds after the epoch (GMT) epochconverter.com")
              .setRequired(true);
        })
      })
        .addSubcommand(jamend=>{
          return jamend
          .setName("jamend")
          .setDescription("Set the time the jam ends")
          .addIntegerOption((option) => {
            return option
              .setName("time")
              .setDescription("The time the jam ends in milliseconds after the epoch (GMT) epochconverter.com")
              .setRequired(true);
        })
      })
        .addSubcommand(general=>{
          return general
          .setName("general")
          .setDescription("View general data set for the current game jam")
      })
      //  .addSubcommand((seeall)=>{
      //    return seeall
      //    .setName("seeall")
      //    .setDescription("See a full list of teams based on their status")
      //    .addStringOption((option)=> {
      //      return option
      //      .setName("status")
      //      .setDescription("The team status you're filtering")
      //      .setRequired(true)
      //      .addChoices({ name:"❌ Preparing",value:"0" }, { name:"⏳ Developing",value:"1" }, { name:"✅ Submitted",value:"2" })
      //  })
        
          
      //}), 
      .addSubcommand(seegames=>{
          return seegames
          .setName("seegames")
          .setDescription("See a full list of all the submitted games")
      })
    // Not finishing this. Use the game jam blacklist role instead, mkay? It's easier that way - chogi
    //.addSubcommand((blacklistSc)=>{
    //  return blacklistSc
    //    .setName("blacklist")
    //    .setDescription("Blacklist a user from making teams or being invited to teams")
    //    .addUserOption((option)=>{
    //      return option
    //        .setName("user")
    //        .setDescription("The user you want to blacklist")
    //        
    //  })
    //})
    
  ];

  guildCommands.forEach((command) => {
    client.guilds.cache.get(guild).commands.create(command);
  });

  client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
      try{
      const commandScript = require("./../../commands/slashCommands/" +
        interaction.commandName +
        "/action.js");
      commandScript(client, interaction);
      }catch(err){
        console.log(err)
        try{
          
          let errReply = {
            embeds:[
              new EmbedBuilder()
              .setTitle("❌ Fatal Error")
              .setDescription("A fatal error occurred and this command could not complete. Staff are actively looking into the issue. Please try again later")
              .setTimestamp()
              .setColor([237, 66, 69])
            ]
          }
          
          interaction.reply(errReply)
        }catch(err){
          console.log("\nError responding to the error\n")
          console.log(err)
        }
      }
    }
  });

  if (db.get("jamGlobal") == null) {
    db.set("jamGlobal", []);
  }

  //db.delete("jamUser.673556688875421720");

  // status update stuff

  const prefNames = {
    "Roblox Site": "Roblox Website",
    "Roblox DocSite": "Roblox Docs",
    GameJoinAPI: "Game Join API",
    GamesAPI: "Games API",
    GroupsAPI: "Groups API",
  };

  const statusEmojis = {
    Up: "<:checkmark2:744660505624444999>",
    Degraded: "<:minusmark2:744660505733365902>",
    Down: "<:xmark2:744660505867714560>",
  };

  // Load all the needed data, create a status message and update records if necessary
  // This section is deprecated, slowly transitioning into loading consitently new and reliable data within the loop
  let previous;
  /*let statusMessage
  let initData = JSON.parse(fs.readFileSync("./status.json"))
  try{
  
    
    let chCache = await client.channels.cache
  
    let statusChannel = await chCache.get(initData.channel);
    
    try{
      statusMessage = await statusChannel.messages.fetch(initData.message)
    }catch{
      const newMessage = await statusChannel.send("Loading...")
      if(newMessage.id == undefined){
        throw("ERR: NO SEND")
      }
      initData.message = newMessage.id
      statusMessage = newMessage
      fs.writeFile("./status.json", JSON.stringify(initData),()=>{})
    }
    
  }catch(error){
    console.log("Something went wrong initiating status feeds. Error reads as follows:\n" + error)
  }*/

  // Verify the integrity of the configuration

  /*const requiredKeys = {"channel":"1008493435621224448","message":"","recents":[],"desperados":["roblox is down"]}
  let dataCheck = JSON.parse(fs.readFileSync("./status.json"))
  let og = JSON.stringify(dataCheck)
    
  async function integCheck(){
    
    for(const [req,fallback] of Object.entries(requiredKeys)){
      if(!( req in dataCheck )){
        console.log(req + " not found in configuration. Fallback implemented")
        dataCheck[req] = fallback
      } 
    }
      
  }
    
  await integCheck()
  
  let statusChannel
  let statusMessage = undefined
  
  async function reinitMessage(){
    let currentData = JSON.parse(fs.readFileSync("./status.json"))
    statusMessage.delete()
    statusMessage = await statusChannel.send("Loading...")
    currentData.message = statusMessage.id
    previous = undefined
    await fs.writeFile("./status.json",JSON.stringify(currentData),()=>{})
  }
  
  async function refresh(){
    
  }
    
  if(og != JSON.stringify(dataCheck)){
    console.log("Fallback implementations saved")
    await fs.writeFile("./status.json",JSON.stringify(dataCheck),()=>{})
  }
  
  client.on("messageCreate",msg=>{
    if(statusChannel && msg.channel.id == statusChannel.id && msg.author.id != client.user.id){
      reinitMessage()
    }
  })
  
  async function status(){
    
    while(true){
      try {
        
        let currentData = JSON.parse(fs.readFileSync("./status.json"))
        let currentStatus;
        
        let chCache = await client.channels.cache
        statusChannel = await chCache.get(currentData.channel);

        if(statusChannel == undefined){
          throw("The channel in the JSON configuration is not reachable. Please reconfigure and relaunch")
        }
        
        try{
          statusMessage = await statusChannel.messages.fetch(currentData.message)
        }catch(err){ 
          console.log("Message not found, rewriting data")
          await reinitMessage()
        }
        
        
        
        await https.get("https://api.statusplus.xyz/status", function(res){
          var body = '';

          res.on('data', function(chunk){
            body += chunk;
          });

          res.on('end', async function(){
            var statusData = JSON.parse(body);

            //if(previous != undefined && JSON.stringify(statusData) == JSON.stringify(previous)){
            //  return
            //}
            
            //previous = statusData

            const { EmbedBuilder } = require("discord.js")
            const embed = new EmbedBuilder()
            .setTitle("Roblox Status")
            .setColor("#859900") // use #859900 to match with text color
            .setTimestamp()
            
            let currentRow = []
            let tables = []
            const tableMode = false // Hey meex, switch this to true if you want to turn on the description-based table view. It's not perfect yet!
            const combineIcons = false // also you can switch this to toggle combining status messages with their corresponding icon. If there's no icon it will just show the status message
            const nameOnly = true 
            const recentsLimit = 5
            const recentsUseFields = true
            
            let composite = ""
            
            statusData.forEach((block,index)=>{
              //let sendval = "```ansi\n[2;32mUp[0m\n```"
              //if(block.status !== "Up"){
              //  sendval = "```ansi\n[2;31m" + block.status + "[0m\n```"
              //  embed.setColor("#B20C00")
              //}
              //embed.addFields({name:block.name,value:sendval,inline:true})
              // commented out code here would have added stylization to how the text looks but it is unsupported on mobile

              if(index > 24){
                return
              }
              
              if(block.status !== "Up"){
                embed.setColor("RED")
                if(embed.color !== "RED" && block.status == "Degraded"){
                  embed.setColor("YELLOW")
                }
                currentData.recents.unshift("<t:" + (Math.floor(Date.now() / 1000)).toString() + ":R> - " + block.name + " went " + block.status)
              }
              
              let prefRowname = block.name
              
              let prefName = block.name
              if(prefName in prefNames){
                prefName = prefNames[prefName]
              }
              
              composite = composite + block.status
              
              let prefStatus = block.status
              if(prefStatus in statusEmojis){
                if(combineIcons){
                  prefRowname = statusEmojis[prefStatus] + " " + prefRowname
                  prefStatus = statusEmojis[prefStatus] + " " + prefStatus
                } else {
                  prefRowname = statusEmojis[prefStatus]
                  prefStatus = statusEmojis[prefStatus]
                }
              }
              
              prefName = prefName + "  "
              currentRow.push(prefRowname)
              
              if(currentRow.length == 3){
                tables.push(table([
                  currentRow
                ]));
                currentRow = []
              }
              
              if(!tableMode){
                
                if(nameOnly){
                  prefName = prefStatus + "   " + prefName
                  prefStatus = "\u200b"
                }
                
                embed.addFields({name:prefName,value:prefStatus,inline:true})
              }
            })
            
            let stitch = ""
            tables.forEach(tble => {
              stitch = stitch + "\n" + tble
            })
            
            embed.setDescription("\u200b")
            
            currentData.recents.forEach((recent,index) => {
              if(index > (recentsLimit - 1)){
                return
              }
              //embed.addFields({name:recent,value:"\u200b",inline:false})
              
              if(recentsUseFields){
                embed.addFields({name:recent,value:"\u200b",inline:false})
              } else {
                let prev = embed.description
                if(!prev){
                prev = ""
                }
                embed.setDescription(prev + recent + "\n")
              }
            })
            
            if(currentData.recents.length == 0  && !recentsUseFields){
              embed.setDescription("No recent status updates.")
            }
            
            if(tableMode){
              embed.setDescription(stitch)
            }  
            //embed.setDescription("Foo \ \ \ \ \ \ \ \ \ bar")
            if(previous != undefined && composite == previous){
              return
            }
            
            await fs.writeFile("./status.json", JSON.stringify(currentData),()=>{})
            previous = composite
            
            embed.addFIelds({name:"Test",value:"foo\nbar\nbaz\nqux",inline:false})
            
            await statusMessage
            
            await statusMessage.edit({embeds:[embed],content:"This is an automated Roblox status report"})
            
            console.log("Status updated")
            
            
          });
        }).on('error', function(e){
          console.log("Got an error: ", e);
        });
        
        
        
        
      } catch(error) {
        console.log("Something went wrong refreshing the status feed. Error reads as follows:\n" + error)
        break
      }
      
      await sleep(2000)
    }
  }

  async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  
  client.on("messageCreate",msg=>{
    const curData = JSON.parse(fs.readFileSync("./status.json"))
    
    if(!("channel" in curData)){
      return
    }
    
    if(msg.channel.id == curData.channel){
      
    }
  })
  
  status()*/

  // END

  //console.log(`${notes.length} ${notes1.length} ${notes2.length}`)

  //    const guild = client.guilds.cache.get('448986884497211392')
  //    let commands

  //    if (guild) {
  //     commands = guild.commands
  //    } else {
  //     commands = client.application?.commands
  //    }

  //    commands?.create({
  //     name: 'rule',
  //     description: 'View the server rules.',
  //     options: [
  //       {
  //         name: 'rule',
  //         description: 'The rule you want to view.',
  //         required: true,
  //         type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
  //       }
  //     ]
  //    })
};
