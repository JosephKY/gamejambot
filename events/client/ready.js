//const { notes, notes1, notes2 } = require("../../notes.json")

const fs = require("fs");
const https = require("https");
const table = require("text-table");
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = async (Discord, client) => {
  
  client.user.setPresence({ activities: [{ name: '/team help' }], status: 'online' })
  
  // START OF CONFIGURATION VARIABLES

  // If you're confused, look at README.md

  client.skillRoles = [
    "853313067856953395", // test role i used
    
    "513792282604994579", // S1
    "513792587212128256", // 3D1
    "513792524473729025", // B1
    "524359638855057409", // GUI1
    "513792867379183627", // A1
    "513794484853800970", // GFX1
    "524359260122120221", // SFX1
    "513795009150189568", // E1
    "728956327698628609", // C1
    
    "457152189950066690", // S2
    "494712657413144576", // 3D2
    "457151805978181634", // B2
    "494709310497095680", // GUI2
    "494708474278707201", // A2
    "457152798862082059", // GFX2
    "524718229294284805", // SFX2
    "509854637164331018", // E2
    "728956428894601236", // C2
    
    "506602134297509888",
    "524735821790707712",
    "504790528353894401",
    "524734265456590848",
    "524722130110119936",
    "524734072828854282",
    "524736287144411146",
    "524736129719730178",
    "728956489053765672",
    
    "847620390158598154",
    "847658063125282839",
    "847621122165178368",
    "847621730531934259",
    "847658107294711831",
    "847658144343916545",
    "847622149217058836",
    "847658206355783691",
    "847658250803085322",
    
  ];

  client.badRoles = [
    "1029577694335213608", // Game jam blacklist
    "737798603053203528", // Marketplace blacklist
    "1029577239467130890" // Game jam blacklist (testing server)
  ]

  let guild = "448986884497211392"

  client.jamCategory = "1086059056801792120";
  client.jamBackupCategory = "1086061268407959642";
  client.jamModIds = ["1086065905399767060", "480493349443469333", "664102752829571083"];
  client.jamStaffChannel = "727153507471327233"
  client.jamLogId = "727153507471327233";
  client.jamRoleId = "1086065219882721321";

  client.minTeamNameLength = 3
  client.maxTeamNameLength = 50
  client.maxTeammates = 4
  client.maxTeams = 250
  
  client.swears = [
    "nigga",
    "nigger",
    "higger",
    "niggers",
    "niger",
    "nigeria",
    "nigerias",
    "nigge",
    "nigges",
    "niggs",
    "ngger",
    "nibba",
    "nibbas",
    "nibbers",
    "negro",
    "negros",
    "neggers",
    "neggs",
    "neggas",
    "niggas",
    "n1gg4",
    "higgers",
    "higger",
    "nig",
    "nigs",
    "niga",
    "nigas",
    "nigers",
    "nighas",
    "nighers",
    "nigghas",
    "nigghers",
    "nigget",
    "niggets",
    "migga",
    "miggas",
    "migger",
    "nxxigger",
    "nogga",
    "noggas",
    "chink",
    "chinks",
    "tard",
    "tards",
    "rtard",
    "rtards",
    "retard",
    "retards",
    "retardo",
    "ratard",
    "retardedness",
    "retarrrded",
    "retarde",
    "retardando",
    "retardism",
    "tarded",
    "retardation",
    "rettardd",
    "rettardedd",
    "retrded",
    "retardsd",
    "retar",
    "retarrded",
    "retarrrded",
    "recktarded",
    "rretarrded",
    "retardant",
    "ritarded",
    "rtarded",
    "retarded",
    "retardted",
    "ritard",
    "fucktard",
    "fag",
    "fags",
    "dyke",
    "dike",
    "tranny",
    "trannie",
    "trannys",
    "trannies",
    "faggot",
    "faggots",
    "newfag",
    "oldfag",
    "newfags",
    "oldfags",
    "fahot",
    "faaaahhot",
    "faggotism",
    "faxxggxxot",
    "faxxgor",
    "creampie",
    "cum",
    "cums",
    "cuxms",
    "cummed",
    "cumed",
    "cumming",
    "cummies",
    "cummy",
    "kum",
    "kummed",
    "kumming",
    "kummies",
    "kummy",
    "creams",
    "creaming",
    "creamed",
    "sperm",
    "sperms",
    "spurm",
    "nutted",
    "nutting",
    "cock",
    "cocks",
    "cocko",
    "kock",
    "dick",
    "dicks",
    "dicked",
    "dvick",
    "dickx",
    "shlong",
    "penis",
    "penises",
    "peaness",
    "peanesses",
    "peanus",
    "dingaling",
    "foreskin",
    "forskin",
    "vagina",
    "vaginas",
    "vagin",
    "coochie",
    "coochies",
    "kochie",
    "cochie",
    "kuchi",
    "cuchi",
    "koochie",
    "kucchie",
    "pussy",
    "pussie",
    "pussys",
    "pussies",
    "pusie",
    "pusy",
    "puscsy",
    "pucsssy",
    "puzzy",
    "cunt",
    "anus",
    "anuses",
    "butthole",
    "buttholes",
    "anas",
    "anal",
    "shota",
    "shotas",
    "bdsm",
    "cbt",
    "virgin",
    "virgins",
    "hentai",
    "kink",
    "kinks",
    "kinky",
    "boob",
    "boobs",
    "bobs",
    "tit",
    "tits",
    "titty",
    "titties",
    "fap",
    "fapping",
    "fapped",
    "masturbate",
    "masturbation",
    "fornication",
    "rape",
    "rapes",
    "raped",
    "raper",
    "raping",
    "dildo",
    "dildos",
    "sex",
    "sexed",
    "seggs",
    "segs",
    "secks",
    "sxual",
    "sxually",
    "porn",
    "prn",
    "sexual",
    "nudes",
    "orgy",
    "orgie",
    "kys",
    "!rank",
    "cunt",
    "allahuakbar",
    "porchmonkey",
    "jiggaboo",
    "redskin",
    "horny",
    "r34",
    "R34",
  ];

  client.strings = { // Don't change the keys! It will break some responses (unless you fix them manually)
    errors:{ 
      "1":"Application commands must be used in a server!",
      "2":"Either an error occurred finding your team or you are not in a team",
      "3":"An error occurred retrieving your team data. Please try again later",
      "4":"Either an error occurred finding your team or you are not a team leader.\nNote: Only team leaders can use this command",
      "5":"The game jam has concluded and this command can no longer be used",
      "6":"An error occurred while retrieving the guild. Please try again later",
      "7":"An error occurred retrieving the team channel. Please try again later",
      "8":`Team names must be between ${client.minTeamNameLength} and ${client.maxTeamNameLength} characters long`,
      "9":"Your chosen team name was moderated for inappropriate content and was not set"
    },
    "helpContent-0":"**😢 Withdrawing From The Jam**\n\n*If you're a team leader and want to withdraw*: You may be able to either leave your team and choose a new leader, or archive your team.\n\n*If you're a teammate*: You may be able to leave your team.\n\nFor either case, create a ticket in <#813074276538253332> and request moderator approval",
    "helpContent-1":"**💔 Removing a Teammate**\n\nIf you're having a conflict with another teammate, for problems such as a lack of productivity or unpleasantness, it's best to attempt and try and work it out with them first.\n\nIf you feel like there's no scenario where they can continue being a viable teammate, you can create a ticket in <#813074276538253332> and request a moderator to remove them. You'll need to provide context to the situation and why they must be removed",
    "helpContent-2":"**💌 Inviting Teammates**\n\nYou can invite anyone to your team as long as they're in the server and don't have a marketplace or game jam blacklist. Try not to invite random people. Rather, invite your friends!\n\nTo get started inviting members, use </team invite:1030918955822485606>**",
    "helpContent-3":"**✅ Submitting Your Game**\n\nWhen you feel ready, you can submit your game at any time after the game jam begins and before it ends. You simply need to set your Roblox game's URL with </team game:1030918955822485606>. You can do this at any time, your project doesn't have to be complete!\n\nThis is something you *must* do before the jam ends, or your creation will most likely not be considered.",
    "helpContent-4":"**✍ Personalizing Your Team**\n\nYou can customize your team by using the </team name:1030918955822485606> command. Your new name will be applied to your team data and your team's channel name. Please note that all names are subject to moderation",
    "helpContent-5":"**👑 Leadership**\n\nLeadership is how we decide who can and can't configure important team data. The leader, usually the team creator, is the only one that can configure the team. We disallow all team members from having leadership to prevent trolling or spam.\n\nIf leadership must be transferred to another teammate for emergency reasons, you can request a moderator to transfer leadership in <#813074276538253332>",
    "teamInvite1": "You're invited to participate in the game jam with <@",
    "teamInvite2": ">'s team.\n\n*There is no obligation to participate*"
  }

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

  console.log("Game jam bot is online!");

  let db = client.db
  
  if (await db.get("jamGeneral") == null){
    let defaultData = {
      "jamstart":0,
      "jamend":0,
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
