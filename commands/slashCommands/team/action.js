
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = async function main(client, interaction) {
  
  let db = client.db
  
  if(!interaction.inGuild()){
    await interaction.deferReply({ephemeral: true})
    interaction.editReply({
        embeds: [
          client.errorEmbed("1")
        ],
      });
      return
  }

  let subcommand = interaction.options.getSubcommand();
  
  if (subcommand == "summary"){
    
    await interaction.deferReply({ephemeral: true})
    
    let leaderId = await db.get("jamUser-" + interaction.user.id)
    if (leaderId == null){
      interaction.editReply({
        embeds: [
          client.errorEmbed("2","TeamSummary")
        ],
      });
      return;
    }
    
    let cur = await db.get("jamTeamData-" + leaderId)
    
    if (cur == null){
      interaction.editReply({
        embeds: [
          client.errorEmbed("3","TeamSummary")
        ],
      });
      return;
    }
    
    let genDesc = "👑 Leader: <@" + cur.leaderId + ">\n👥 Teammates: "
    cur.teammates.forEach(mate=>{
      genDesc = genDesc + " <@" + mate + ">"
    }) 
    genDesc = genDesc + "\n💌 Invited Teammates: " 
    cur.invited.forEach(mate=>{
      genDesc = genDesc + " <@" + mate + ">"
    }) 
    genDesc = genDesc + "\n🌐 Game URL: " + cur.game + "\n#️⃣ Channel: <#" + cur.channelId + ">\n⌚ Created: <t:" + Math.floor(cur.created / 1000) + ":F>"  
    
    let payload = {
      embeds:[
        new EmbedBuilder()
        .setTitle("ℹ Team Summary")
        .setColor([114, 137, 218])
        .setTimestamp()
        .setDescription(genDesc)
      ]
    }
    
    interaction.editReply(payload)
  }
  
  
  
  if (subcommand == "withdraw"){
    return
    await interaction.deferReply({ephemeral: true})
    
    let cur = await db.get("jamTeamData-" + interaction.user.id);
    if (cur == null) {
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Team Not Found")
            .setDescription(
              "Either an error occurred finding your team or you do not own a team. Keep in mind only team leaders can change the name of their team"
            )
            .setTimestamp(),
        ],
      });
      return;
    }
    
    let general = await db.get("jamGeneral")
    if (cur == null) {
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Error Occurred")
            .setDescription(
              "Something went wrong getting game jam data. Please try again later!"
            )
            .setTimestamp(),
        ],
      });
      return;
    }
    
    if (general.jamstart > Date.now()){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Withdraw Rejected")
            .setDescription(
              "The game jam has already started and you can no longer officially withdraw without permission. To request permission, ask a moderator by creating a ticket in <#813074276538253332>\n\nNote that you are not *required* to complete the jam"
            )
            .setTimestamp(),
        ],
      });
      return;
    }
    
    if (cur.teammates.length > 1){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Withdraw Rejected")
            .setDescription(
              "You can't withdraw without permission while you have teammates in your team. To request permission, ask a moderator by creating a ticket in <#813074276538253332>"
            )
            .setTimestamp(),
        ],
      });
      return;
    }
    
    
  }
  
  if (subcommand == "help"){
    
    await interaction.deferReply({ephemeral: true})
    
    let cat = interaction.options.getString("category")
    
    let content = client.string(`helpContent-${cat}`)
    
    let teamHelpPayload = {
      embeds:[
        new EmbedBuilder()
        .setTitle("ℹ Help and Information")
        .setColor([52, 152, 219])
        .setDescription(content)
        .setTimestamp()
      ],
    }
    
    interaction.editReply(teamHelpPayload)
  }
  
  if (subcommand == "status"){
    return
    // This is UNUSED!
    await interaction.deferReply({ephemeral: true})
    
    let equivalent = {
      "0":"❌ Preparing",
      "1":"⏳ Developing",
      "2":"✅ Submitted"
    }
    
    let newStatus = interaction.options.getString("status")
    
    let cur = await db.get("jamTeamData-" + interaction.user.id);
    if (cur == null) {
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Team Not Found")
            .setDescription(
              "Either an error occurred finding your team or you do not own a team. Keep in mind only team leaders can change the name of their team"
            )
            .setTimestamp(),
        ],
      });
      return;
    }
    
    if (cur.status == newStatus) {
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Cannot Set Status")
            .setDescription(
              "You tried to set your status to what is already your current status"
            )
            .setTimestamp(),
        ],
      });
      return;
    }
    
    let general = await db.get("jamGeneral")
    
    if(general.jamstart > Date.now()){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Cannot Set Status")
            .setDescription(
              "You cannot set your team status until the game jam starts at <t:" + Math.floor(general.jamstart / 1000) + ":F>"
            )
            .setTimestamp(),
        ],
      });
      return;
    }
    
    if(cur.game == undefined){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Cannot Set Status")
            .setDescription(
              "Set your Roblox game with </team game:1030918955822485606> before changing your status"
            )
            .setTimestamp(),
        ],
      });
      return;
    }
    
    if(general.jamend + 10800000 < Date.now()){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Cannot Set Status")
            .setDescription(
              "You cannot set your team status now because the jam is over"
            )
            .setTimestamp(),
        ],
      });
      return;
    }
    
    let teamGuild = await client.guilds.cache.get(cur.guildId)
    if(!teamGuild) {
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Error Occurred")
            .setDescription(
              "There was a problem retrieving the guild associated with your team. Please try again later"
            )
            .setTimestamp(),
        ],
      });
      return;
    }

    let teamChannel = await teamGuild.channels.cache.get(cur.channelId);
    if (!teamChannel) {
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Error Occurred")
            .setDescription(
              "There was a problem retrieving the channel associated with your team. Please try again later"
            )
            .setTimestamp(),
        ],
      });
      return;
    }
    
    teamChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor([88, 101, 242])
          .setTitle("📄 Status Changed")
          .setDescription(
            "Team status changed to ``" +
              equivalent[newStatus] +
              "`` by team leader <@" +
              interaction.user.id +
              ">"
          )
          .setTimestamp(),
      ],
    });
    
    await db.push("jamStatus-" + newStatus, interaction.user.id)
    await db.pull("jamStatus-" + cur.status, interaction.user.id)
    
    cur.status = newStatus
    await db.set("jamTeamData-" + interaction.user.id, cur)
    
    
    
    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor([87, 242, 136])
          .setTitle("✅ Team Status Set")
          .setDescription("Your team status has been set to ``" + equivalent[newStatus] + "``")
          .setTimestamp(),
      ],
    });
  }
  
  if (subcommand == "name") {
    
    await interaction.deferReply({ephemeral: true})
    
    let cur = await db.get("jamTeamData-" + interaction.user.id);
    if (cur == null) {
      interaction.editReply({
        embeds: [
          client.errorEmbed("4","TeamName")
        ],
      });
      return;
    }
    
    let generalData = await db.get("jamGeneral")
    
    if (generalData.jamend < Date.now()){
      interaction.editReply({
        embeds: [
          client.errorEmbed("5","TeamName")
        ],
      });
      return;
    }
    
    let teamGuild = await client.guilds.cache.get(cur.guildId)
    if(!teamGuild) {
      interaction.editReply({
        embeds: [
          client.errorEmbed("6","TeamName")
        ],
      });
      return;
    }

    let teamChannel = await teamGuild.channels.cache.get(cur.channelId);
    if (!teamChannel) {
      interaction.editReply({
        embeds: [
          client.errorEmbed("7","TeamName")
        ],
      });
      return;
    }

    let name = interaction.options.getString("name");
    if (name.length > 50 || name.length < 3) {
      interaction.editReply({
        embeds: [
          client.errorEmbed("8","TeamName")
        ],
      });
      return;
    }

    let closeArray = name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(" ");
    let swears = client.swears
    let bad = false;
    for (var i = 0; i < swears.length; i++) {
      if (closeArray.includes(swears[i])) {
        bad = true;
        break;
      }
    }

    if (bad) {
      interaction.editReply({
        embeds: [
          client.errorEmbed("9","TeamName")
        ],
      });
      return;
    }

    teamChannel.setName(name);
    cur["name"] = name;
    await db.set("jamTeamData-" + interaction.user.id, cur);

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor([87, 242, 136])
          .setTitle("✅ Team Name Set")
          .setDescription("Your team's name has been set to ``" + name + "``")
          .setTimestamp(),
      ],
    });

    teamChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor([88, 101, 242])
          .setTitle("✍ Name Changed")
          .setDescription(
            "Team name changed to ``" +
              name +
              "`` by team leader <@" +
              interaction.user.id +
              ">"
          )
          .setTimestamp(),
      ],
    });
  }
  if (subcommand == "transfer") {
    
    await interaction.deferReply({ephemeral: true})
    
    let newLeader = interaction.options.getUser("teammate");
    let cur = await db.get("jamTeamData-" + interaction.user.id);
    if (cur == null) {
      interaction.editReply({
        embeds: [
          client.errorEmbed("4","TeamTransfer")
        ],
      });
      return;
    }
    
    if(newLeader.id == interaction.user.id){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Action Disallowed")
            .setDescription(
              "You cannot transfer leadership to the current leader"
            )
            .setTimestamp(),
        ],
      });
      return;
    }

    if (!cur.teammates.includes(newLeader.id)) {
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Teammate Not Found")
            .setDescription(
              "The user selected either could not be found or is not a participating teammate"
            )
            .setTimestamp(),
        ],
      });
      return;
    }

    cur["leaderId"] = newLeader.id;
    await db.set("jamTeamData-" + newLeader.id, cur);
    await db.delete("jamTeamData-" + interaction.user.id);
    cur.teammates.forEach(async mate=>{
      await db.set("jamUser-" + mate, newLeader)
    })

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor([87, 242, 136])
          .setTitle("✅ Leadership Transferred")
          .setDescription(
            "Leadership was transferred successfully. If you did this by mistake, contact a moderator in <#813074276538253332>"
          )
          .setTimestamp(),
      ],
    });
    
    let teamGuild = await client.guilds.cache.get(cur.guildId)
    if(!teamGuild) {
      /*
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Error Occurred")
            .setDescription(
              "There was a problem retrieving the guild associated with your team. Please try again later"
            )
            .setTimestamp(),
        ],
        ephemeral: true,
      });*/
      return;
    }

    let teamChannel = await teamGuild.channels.cache.get(
      cur["channelId"]
    );
    if(!teamChannel) {
      /*
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Error Occurred")
            .setDescription(
              "There was a problem retrieving the channel associated with your team. Please try again later"
            )
            .setTimestamp(),
        ],
        ephemeral: true,
      });
      */
      return;
    }
    
    teamChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTimestamp()
          .setColor([88, 101, 242])
          .setTitle("👑 Leadership Transferred")
          .setDescription(
            "Team leadership was transferred from <@" +
              interaction.user.id +
              "> to <@" +
              newLeader.id +
              ">"
          ),
        ],
    });
  }
  if (subcommand == "game") {
    
    await interaction.deferReply({ephemeral: true})
    
    let cur = await db.get("jamTeamData-" + interaction.user.id);
    if (cur == null) {
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Team Not Found")
            .setDescription(
              "Either an error occurred finding your team or you do not own a team. Keep in mind only team leaders can change the game URL"
            )
            .setTimestamp(),
        ],
      });
      return;
    }
    
    let generalData = await db.get("jamGeneral")
    
    if (generalData.jamend < Date.now()){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ Error")
            .setDescription(
              "The game jam has ended and you cannot change your game URL anymore"
            )
            .setColor([237, 66, 69]),
        ],
      });
      return;
    }
      
    if (generalData.jamstart > Date.now()){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ Error")
            .setDescription(
              "You can't set your game URL until the jam begins!"
            )
            .setColor([237, 66, 69]),
        ],
      });
      return;
    }

    let game = interaction.options.getString("url");
    try {
      new URL(game);
    } catch (error) {
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Invalid URL")
            .setDescription(
              "The URL you entered was not accepted because it is an invalid URL. Make sure it is a full URL, protocol included\n\n❌ ``roblox.com/games/47324/Sword-Fights-on-the-Heights-IV``\n❌ ``www.roblox.com/games/47324/Sword-Fights-on-the-Heights-IV``\n✅ ``https://roblox.com/games/47324/Sword-Fights-on-the-Heights-IV``\n✅ ``https://www.roblox.com/games/47324/Sword-Fights-on-the-Heights-IV``"
            )
            .setTimestamp(),
        ],
      });
      return;
    }

    let gameUrl = new URL(game);
    let hn = gameUrl.hostname;
    if (
      hn != "roblox.com" &&
      hn != "www.roblox.com" &&
      hn != "web.roblox.com" &&
      hn != "ro.blox.com"
    ) {
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Invalid URL")
            .setDescription(
              "The URL you entered was not accepted because it is not a roblox link"
            )
            .setTimestamp(),
        ],
      });
      return;
    }

    //let webAlertGuildId = "448986884497211392"
    //let webAlertChannelId = "1027315555134357514";
    if (hn == "web.roblox.com") {
      //let webAlertGuild = await client.guilds.cache.get(webAlertGuild)
      
      if(true){ // dont ask why
        let webAlertChannel = await interaction.guild.channels.cache.get(client.jamStaffChannel);
        if (webAlertChannel != undefined) {
          webAlertChannel.send({
            embeds: [
              new EmbedBuilder()
                .setTitle("⚠ Underage Detected")
                .setColor([254, 230, 92])
                .setTimestamp()
                .setDescription(
                  "A web.roblox.com link was submitted for a game jam team URL"
                )
                .addFields(
                  {
                    name: "Team Leader",
                  value: "<@" + cur.leaderId + ">",
                  },
                  {
                    name: "Submitting User",
                    value: "<@" + interaction.user.id + ">",
                  },
                  {
                    name: "Team Channel",
                    value: "<#" + cur.channelId + ">",
                  },
                  {
                    name: "URL Submitted",
                    value: game,
                  }
                ),
            ],
          });
        }
      }
      
      
    }

    if (
      !gameUrl.search.includes("games") &&
      !gameUrl.pathname.includes("/games/")
    ) {
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Invalid URL")
            .setDescription(
              "The URL you entered was not accepted because it is not a roblox game link"
            )
            .setTimestamp(),
        ],
      });
      return;
    }

    cur["game"] = game;
    await db.set("jamTeamData-" + interaction.user.id, cur);
    
    let games = await db.get("jamGames")
    if(games == null || !(games.includes(interaction.user.id))){
      await db.push("jamGames",interaction.user.id)
    }

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor([87, 242, 136])
          .setTitle("✅ Game Link Updated")
          .setDescription("Your team's game link was updated successfully")
          .setTimestamp(),
      ],
    });
    
    let teamGuild = await client.guilds.cache.get(cur.guildId)
    if(!teamGuild){
      /*
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Error Occured")
            .setDescription(
              "There was a problem retrieving the invitee through the guild data. Please try again later!"
            )
            .setTimestamp(),
        ],
      });
      */
      return
    }

    let teamChannel = await teamGuild.channels.cache.get(cur.channelId);
    if (teamChannel != undefined) {
      teamChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("🌐 Game Link Updated")
            .setDescription("The team game URL was updated to:\n" + game)
            .setColor([88, 101, 242])
            .setTimestamp(),
        ],
      });
    }
  }
  if (subcommand == "invite"){
    
    await interaction.deferReply({ephemeral: true})
    
    let cur = await db.get("jamTeamData-" + interaction.user.id);
    if (cur == null) {
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Team Not Found")
            .setDescription(
              "Either an error occurred finding your team or you do not own a team. Keep in mind only team leaders can invite members to a team"
            )
            .setTimestamp(),
        ],
      });
      return;
    } 
    
    let generalData = await db.get("jamGeneral")
      
      if (generalData.jamstart < Date.now()){
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Invite Rejected")
              .setDescription(
                "The game jam has already begun and it is no longer possible to invite anyone to any team. Sorry!"
              )
              .setColor([237, 66, 69]),
          ],
        });
        return;
      }
    
    if(cur.teammates.length >= client.maxTeammates){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Invite Rejected")
            .setDescription(
              "You cannot have more than 4 teammates"
            )
            .setTimestamp(),
        ],
      });
      return
    }
    
    let invitee = interaction.options.getUser("member")
    
    invitee = interaction.guild.members.cache.get(invitee.id)
    if(invitee == undefined){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Error Occurred")
            .setDescription(
              "There was a problem getting the user's member data. Please try again later"
            )
            .setTimestamp(),
        ],
      });
      return
    }
    
    let invalidRoles = (invitee.roles.cache.filter(r=>{ return client.badRoles.indexOf(r.id) > -1 }))
    if (invalidRoles.size > 0){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Invite Rejected")
            .setDescription(
              "The member you attempted to invite is not allowed to participate in a game jam because of a marketplace or game jam blacklist"
            )
            .setTimestamp(),
        ],
      });
      return
    }
    
    if(cur.invited.includes(invitee.id)){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Invite Rejected")
            .setDescription(
              "You already invited this member. You cannot invite the same person more than once"
            )
            .setTimestamp(),
        ],
      });
      return
    }
    
    if(invitee.bot){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Invite Rejected")
            .setDescription(
              "You cannot invite a bot!"
            )
            .setTimestamp(),
        ],
      });
      return
    }
    
    if(cur.teammates.includes(invitee.id)){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Invite Failed")
            .setDescription(
              "The member you tried to invite is already associated with your team"
            )
            .setTimestamp(),
        ],
      });
      return
    }
    
    let userData = await db.get("jamUser-" + invitee.id)
    if(userData != null){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Invite Failed")
            .setDescription(
              "The member you tried to invite is already associated with another team"
            )
            .setTimestamp(),
        ],
      });
      return
    }
    
    let teamGuild = await client.guilds.cache.get(cur.guildId)
    if(!teamGuild){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Error Occured")
            .setDescription(
              "There was a problem retrieving the invitee through the guild data. Please try again later!"
            )
            .setTimestamp(),
        ],
      });
      return
    }
    
    let memberObject = await teamGuild.members.cache.get(invitee.id)
    if(memberObject == undefined){
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Error Occured")
            .setDescription(
              "There was a problem retrieving the invitee. Please try again later!"
            )
            .setTimestamp(),
        ],
      });
      return
    }
    
    try{
      const crypto = require("crypto")
      let inviteToken = crypto.randomBytes(25).toString('hex')
      
      let invitePayload = {
        embeds:[
          new EmbedBuilder()
          .setTitle("✉ You're Invited!")
          .setColor([87, 242, 136])
          .setDescription(client.string("teamInvite1") + interaction.user.id + client.string("teamInvite2"))
          .setTimestamp()
        ],
        components:[
          new ActionRowBuilder()
          .addComponents([
            new ButtonBuilder()
            .setLabel("Accept")
            .setEmoji("✔")
            .setStyle(3)
            .setCustomId("jamAccept-" + inviteToken),
            //new ButtonBuilder()
            //.setLabel("Reject")
            //.setEmoji("✖")
            //.setStyle(4)
            //.setCustomId("jamReject." + inviteToken)
          ])
        ]
      }
      
      let inviteData = {
        "leader":interaction.user.id,
        "channel":cur.channelId,
        "guild":interaction.guild.id,
        "invited":invitee.id,
        "tkn":inviteToken,
        //"expires":Date.now() + 86400000,
        "used":false,
      }
      
      let canSend = true
      memberObject.send(invitePayload).catch(()=>{
        interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Invite Rejected")
            .setDescription(
              "The member you tried to invite could not be invited because they only accept direct messages from friends or have disabled direct messages from strangers in this server"
            )
            .setTimestamp(),
          ],
        });
        canSend = false
      })
      
      if(!canSend){
        throw "Cannot send invite message"
      }
      
      cur.invited.push(invitee.id)
      await db.set("jamTeamData-" + interaction.user.id, cur)
      await db.set("jamInvite-" + inviteToken,inviteData)
      
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setColor([87, 242, 136])
          .setTitle("✅ Member Invited")
          .setDescription("<@" + invitee.id + "> was successfully invited to join your team")
          .setTimestamp(),
        ],
      });
      
      let teamGuild = await client.guilds.cache.get(cur.guildId)
      if(!teamGuild){
        /*
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor([237, 66, 69])
              .setTitle("❌ Error Occured")
              .setDescription(
                "There was a problem retrieving the invitee through the guild data. Please try again later!"
              )
              .setTimestamp(),
          ],
          ephemeral: true,
        });
        */
        return
      }
      
      let teamChannel = await teamGuild.channels.cache.get(cur.channelId)
      if(teamChannel != undefined){
        teamChannel.send({
          embeds: [
            new EmbedBuilder()
              .setTimestamp()
              .setColor([88, 101, 242])
              .setTitle("✉ Invitation Sent")
              .setDescription("Member <@" + invitee.id + "> was invited to join the team by team leader <@" + interaction.user.id + ">"),
          ],
        })
      }
      
    }catch(error){
      /*
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("❌ Invite Rejected")
            .setDescription(
              "The member you tried to invite could not be invited because they only accept direct messages from friends or have disabled direct messages from strangers in this server"
            )
            .setTimestamp(),
        ],
      });
      */
      return
    }
  }
};
