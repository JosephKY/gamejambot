
module.exports = async (Discord, client, interaction) => {
  let db = client.db
  const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    EmbedBuilder,
    ButtonBuilder,
  } = require("discord.js");
  const extractUrls = require("extract-urls");

  /*if (interaction.isButton()) {
    switch(interaction.customId) {
        
      case 'createEventIdea':
        interaction.reply({content: "created a new event idea", ephemeral: true})
        break
        
      default:
        interaction.update({})
      
    } 
  }*/

  if (interaction.isButton()) {
    // With if conditionals

    if (interaction.customId == "jamCreateTeam") {
      
      let currentJam = await db.get("jamTeamData-" + interaction.user.id);
      let userData = await db.get("jamUser-" + interaction.user.id);
      let validRoles = (interaction.member.roles.cache.filter(r=>{ return client.skillRoles.indexOf(r.id) > -1 }))
      let invalidRoles = (interaction.member.roles.cache.filter(r=>{ return client.badRoles.indexOf(r.id) > -1 }))
      let generalData = await db.get("jamGeneral")
      let am = generalData.count
      
      if(generalData.count == undefined){
        generalData.count = client.maxTeams
        am = client.maxTeams
      }
      
      if(am <= 0){
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Cannot Create Team")
              .setDescription(
                "The maximum amount of teams have been reached and creating a team is no longer possible. Sorry!"
              )
              .setColor("0xED4245"),
          ],
          ephemeral: true,
        });
        return;
      }
      
      if (generalData.jamstart < Date.now()){
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Cannot Create Team")
              .setDescription(
                "The game jam has already begun and it is no longer possible to start new teams or join any existing teams. Sorry!"
              )
              .setColor("0xED4245"),
          ],
          ephemeral: true,
        });
        return;
      }
      
      if (invalidRoles.size > 0) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Cannot Create Team")
              .setDescription(
                "You are either blacklisted from the marketplace or you are blacklisted from game jams. Either consequence is a disqualifier for any game jam participation. If you want to try and appeal these blacklists, create a ticket in <#813074276538253332>"
              )
              .setColor("0xED4245"),
          ],
          ephemeral: true,
        });
        return;
      }
      
      if (validRoles.size == 0){
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Cannot Create Team")
              .setDescription(
                "You must have at least one skill rank to create a team"
              )
              .setColor("0xED4245")
          ],
          ephemeral: true,
          components:[
            new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
              .setStyle(5)
              .setURL("https://discord.com/channels/448986884497211392/745304862576738435/834792730986414101")
              .setLabel("Earning Skill Ranks")
            )
          ]
        });
        return;
      }
      
      if (currentJam != null) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Team Already Owned!")
              .setDescription(
                "You already own a game jam team! Find it here: <#" +
                  currentJam["channelId"] +
                  ">"
              )
              .setColor("0xED4245"),
          ],
          ephemeral: true,
        });
        return;
      }

      if (userData != null) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Already Participating!")
              .setDescription(
                "You can't start a team if you're already in one. If you want to leave your team and start one yourself, contact a moderator in <#813074276538253332>"
              )
              .setColor("0xED4245"),
          ],
          ephemeral: true,
        });
        return;
      }

      const { PermissionsBitField } = require("discord.js");
      let modRole = interaction.guild.roles.cache.find(
        (r) => r.id === client.jamModId
      );
      if (!modRole) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Something Went Wrong")
              .setDescription(
                "Channel permissions couldn't properly be set and the bot failed to create your team. Please try again later!"
              )
              .setColor("0xED4245"),
          ],
          ephemeral: true,
        });
        return;
      }
      let channelName = "Team " + interaction.user.username;

      try {
        channelName = channelName.substring(0, 100);
        let teamChannel = await interaction.guild.channels.create({
          name: channelName,
          type: 0, // text
          permissionOverwrites: [{
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel]
          }]
        });

        let defaultPerms = [
          // Allow only the team creator and mods to view the new channel
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: modRole.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
        ];

        teamChannel.setParent(client.jamCategory).catch(async ()=>{
          let staffChannel = await interaction.guild.channels.cache.get(client.jamStaffChannel)
          if(staffChannel != undefined){
            staffChannel.send({
              embeds:[
                new EmbedBuilder()
                .setTitle("⚠️ Max Channels Reached!")
                .setDescription("The max channels for the designated game jam teams channel category has been reached and the backup category was used. Please create a new category and configure the bot to use it.")
                .setColor("0xF1C40F")
                .setTimestamp()
              ]
            })
          }
          teamChannel.setParent(client.jamBackupCategory).catch(()=>{
            if(staffChannel != undefined){
              staffChannel.send({
                embeds:[
                  new EmbedBuilder()
                  .setTitle("⚠️ Backup Category Failed!")
                  .setDescription(`The backup category was attempted and the attempt failed. **Team channel <#${teamChannel.id}> has no category**`)
                  .setColor("0xF1C40F")
                  .setTimestamp()
                ]
              })
            }
          });
        });
        teamChannel.permissionOverwrites.set(
          defaultPerms,
          "Default team perms"
        );

        let infoPayload = {
          embeds: [
            new EmbedBuilder()
              .setTitle("🎉 Welcome")
              .setDescription(
                "Welcome to your team channel! You can get started by checking out the following slash commands:\n\n</team summary:1030918955822485606> - View a summary of your team's information\n</team help:1030918955822485606> - View help and information for a specific issue\n</team invite:1030918955822485606> - Invite a member in the server to join your team. This can only be done once per member\n</team game:1030918955822485606> - Set the Roblox experience URL associated with your game\n</team name:1030918955822485606> - Set the name for your team\n\nWithdrawing, deleting your team, transferring leadership, or removing teammates require moderator approval. To get approval, create a ticket in <#813074276538253332> and talk to a moderator"
              )
              .setColor("0x5865F2")
              .setTimestamp(),
            new EmbedBuilder()
              .setTitle("👑 Current Leader")
              .setColor("0xF1C40F")
              .setDescription(
                "The leader of this team is <@" + interaction.user.id + ">"
              ),
          ],
        };

        teamChannel.send(infoPayload);

        let dataPayload = {
          name: channelName,
          channelId: teamChannel.id,
          guildId: interaction.guild.id,
          leaderId: interaction.user.id,
          game: undefined,
          invited: [],
          teammates: [interaction.user.id],
          teammatesPerm: [interaction.user.id],
          created: Date.now(),
          status: "0"
        };
        
        let statusPayload = {
          leaderId: interaction.user.id,
          channelId: teamChannel.id
        }

        generalData.count = generalData.count - 1
        
        await db.set("jamTeamData-" + interaction.user.id, dataPayload);
        await db.set("jamUser-" + interaction.user.id, interaction.user.id);
        //await db.push("jamStatus-0", statusPayload)
        await db.set("jamGeneral", generalData)
        
        let jamRole = await interaction.guild.roles.cache.get(client.jamRoleId)
        if(jamRole != undefined){
          interaction.member.roles.add(jamRole)
        }

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("✅ Team Created")
              .setDescription(
                "Your team has been created! Get started in <#" +
                  teamChannel.id +
                  ">"
              )
              .setColor("0x57F287"),
          ],
          ephemeral: true,
        });
      } catch (error) {
        console.log(error);
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Something Went Wrong")
              .setDescription(
                "An unknown error occurred and the bot failed to create your team. Please try again later!"
              )
              .setColor("0xED4245"),
          ],
          ephemeral: true,
        });
        return;
      }
    }

    if (interaction.customId.startsWith("jamAccept-")) {
      let tkn = interaction.customId.split("-")[1];
      let data = await db.get("jamInvite-" + tkn);
      let selfData = await db.get("jamUser-" + interaction.user.id);
      let generalData = await db.get("jamGeneral")
      
      if (generalData.jamstart < Date.now()){
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Cannot Accept Invite")
              .setDescription(
                "The game jam has already begun and it is no longer possible to join any teams. Sorry!"
              )
              .setColor("0xED4245"),
          ],
          ephemeral: true,
        });
        return;
      }
      

      if (selfData) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("0xED4245")
              .setTitle("❌ Cannot Accept Invite")
              .setDescription(
                "You're already associated with a team and you cannot be in two teams at once"
              )
              .setTimestamp(),
          ],
          ephemeral: true,
        });
        return;
      }

      if (data == null) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("0xED4245")
              .setTitle("❌ Error Occurred")
              .setDescription(
                "There was a problem retrieving the invite data. Please try again later!"
              )
              .setTimestamp(),
          ],
          ephemeral: true,
        });
        return;
      }
      
      if (data.used) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("0xED4245")
              .setTitle("❌ Expired")
              .setDescription(
                "This invite has expired and no responses can be made anymore"
              )
              .setTimestamp(),
          ],
          ephemeral: true,
        });
        return;
      }
      
      if (data.guild == undefined){
        return;
      }
      
      let guild = client.guilds.cache.get(data.guild)
      
      if (!guild) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Error Occurred")
              .setDescription(
                "There was a problem loading guild data. Please try again later!"
              )
              .setColor("0xED4245"),
          ],
          ephemeral: true,
        });
        return;
      }
      
      let member = await guild.members.fetch(interaction.user.id)
      
      if (!member){
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Error Occurred")
              .setDescription(
                "There was a problem loading member data. Please try again later!"
              )
              .setColor("0xED4245"),
          ],
          ephemeral: true,
        });
        return;
      }
      
      let invalidRoles = (member.roles.cache.filter(r=>{ return client.badRoles.indexOf(r.id) > -1 }))
      
      if (invalidRoles.size > 0) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Cannot Accept Invite")
              .setDescription(
                "You are either blacklisted from the marketplace or you are blacklisted from game jams. Either consequence is a disqualifier for any game jam participation. If you want to try and appeal these blacklists, create a ticket in <#813074276538253332>"
              )
              .setColor("0xED4245"),
          ],
          ephemeral: true,
        });
        return;
      }

      let cur = await db.get("jamTeamData-" + data.leader);
      if (cur == null) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("0xED4245")
              .setTitle("❌ Error Occurred")
              .setDescription(
                "There was a problem retrieving the inviter data. Please try again later!"
              )
              .setTimestamp(),
          ],
          ephemeral: true,
        });
        return;
      }

      if (
        cur.channelId != data.channel ||
        interaction.user.id != data.invited ||
        !cur.invited.includes(interaction.user.id)
      ) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("0xED4245")
              .setTitle("❌ Error Occurred")
              .setDescription(
                "There was a discrepancy in the invite data and this invite cannot be used anymore"
              )
              .setTimestamp(),
          ],
          ephemeral: true,
        });
        data.used = true;
        await db.set("jamInvite-" + tkn, data);

        interaction.message.edit({
          embeds: interaction.message.embeds,
          components: [],
          content:
            "❌ This invite was marked invalid on <t:" +
            Math.floor(Date.now() / 1000) +
            ":F> due to a data discrepancy",
        });

        return;
      }

      if (cur.teammates.length >= 4) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("0xED4245")
              .setTitle("❌ Too Many Members")
              .setDescription(
                "The team this invite is related to currently has too many teammates and this invite is currently invalid"
              )
              .setTimestamp(),
          ],
          ephemeral: true,
        });
        return;
      }

      let teamChannel = await client.guilds.cache
        .get(cur.guildId)
        .channels.cache.get(cur.channelId);
      if (!teamChannel) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("0xED4245")
              .setTitle("❌ Error Occurred")
              .setDescription(
                "The team associated with this invite no longer exists and this invite is now invalid"
              )
              .setTimestamp(),
          ],
          ephemeral: true,
        });

        data.used = true;
        await db.set("jamInvite-" + tkn, data);

        interaction.message.edit({
          embeds: interaction.message.embeds,
          components: [],
          content:
            "❌ This invite was marked invalid on <t:" +
            Math.floor(Date.now() / 1000) +
            ":F> due to the team no longer existing",
        });

        return;
      }

      cur.invited.splice(cur.invited.indexOf(interaction.user.id), 1);
      cur.teammates.push(interaction.user.id);
      cur.teammatesPerm.push(interaction.user.id);
      await db.set("jamTeamData-" + cur.leaderId, cur);

      data.used = true;
      await db.set("jamInvite-" + tkn, data);

      await db.set("jamUser-" + interaction.user.id, cur.leaderId);

      teamChannel.permissionOverwrites.edit(interaction.user, {
        ViewChannel: true,
      });
      
      let jamRole = await client.guilds.cache.get(cur.guildId).roles.cache.get(client.jamRoleId)
      if(jamRole != undefined){
        member.roles.add(jamRole)
      }

      interaction.message.edit({
        embeds: interaction.message.embeds,
        components: [],
        content:
          "✅ This invite was accepted on <t:" +
          Math.floor(Date.now() / 1000) +
          ":F>",
      }).catch(()=>{})

      teamChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("🎉 Invite Accepted")
            .setColor("0x57F287")
            .setTimestamp()
            .setDescription(
              "Member <@" +
                interaction.user.id +
                "> accepted their invite from team leader <@" +
                cur.leaderId +
                "> and are now a part of this team!"
            ),
        ],
      });

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("0x57F287")
            .setTitle("✅ Invite Accepted")
            .setDescription(
              "Invite was accepted successfully! You can find your team's channel in <#" +
                cur.channelId +
                ">. Good luck and have fun!"
            )
            .setTimestamp(),
        ],
      });
    }
    
    if (interaction.customId.startsWith("jSV_")){
      let type = interaction.customId.split("jSV_")[1].split("-")[0]
      let ogId = interaction.customId.split("-")[1]
      let ogData = await db.get("jamInteractionData-" + ogId)
      console.log(ogId)
      console.log(ogData)
      
      if(ogData == null){
        interaction.reply({
          content:"Operation failed. Please try again later",
          ephemeral: true
        })
        return
      }
      
      let total = ogData.total
      let pages = ogData.pages
      let page = ogData.page
      
      if((type == "First" && page == 0) || (type == "Previous" && page == 0) || (type == "Next" && page == (pages.length - 1)) || (type == "Last" && page == (pages.length - 1))){
        interaction.deferUpdate();
        return
      }
      
      if(type == "First"){
        ogData.page = 0
      }
      
      if(type == "Previous"){
        ogData.page = ogData.page - 1
      }
      
      if(type == "Next"){
        ogData.page = ogData.page + 1
      }
      
      if(type == "Last"){
        ogData.page = pages.length - 1
      }
      
      let pageData = pages[ogData.page]
        
      let genDesc = ""
      pageData.forEach(info=>{
        genDesc = genDesc + "Leader <@" + info + ">\n"
      })
    
      let replyPayload = {
        embeds:[
          new EmbedBuilder()
          .setTitle("🔍 Search Results")
          .setDescription(genDesc)
          .setFooter({text: "Page " + (ogData.page + 1) + " of " + pages.length + ", " + total + " results total"})
          .setTimestamp()
          .setColor("0x7289DA")
        ]
      }
      
      interaction.message.edit({
        embeds: replyPayload['embeds'],
        components: interaction.message.components
      })
      
      interaction.deferUpdate();
      
      await db.set("jamInteractionData-" + ogId, ogData)
      
    }
    
    if (interaction.customId.startsWith("jGV_")){
      let type = interaction.customId.split("jGV_")[1].split("-")[0]
      let ogId = interaction.customId.split("-")[1]
      let ogData = await db.get("jamInteractionData-" + ogId)
      console.log(ogId)
      console.log(ogData)
      
      if(ogData == null){
        interaction.reply({
          content:"Operation failed. Please try again later",
          ephemeral: true
        })
        return
      }
      
      let total = ogData.total
      let pages = ogData.pages
      let page = ogData.page
      
      if((type == "First" && page == 0) || (type == "Previous" && page == 0) || (type == "Next" && page == (pages.length - 1)) || (type == "Last" && page == (pages.length - 1))){
        interaction.deferUpdate();
        return
      }
      
      if(type == "First"){
        ogData.page = 0
      }
      
      if(type == "Previous"){
        ogData.page = ogData.page - 1
      }
      
      if(type == "Next"){
        ogData.page = ogData.page + 1
      }
      
      if(type == "Last"){
        ogData.page = pages.length - 1
      }
      
      let pageData = pages[ogData.page]
        
      let genDesc = ""
      
      for await (const info of pageData){
        let cur = await db.get("jamTeamData-" + info)
        if (cur==null) {
          continue
        }
        genDesc = genDesc + "Leader <@" + info + "> - " + cur.game + "\n"
      }
    
      let replyPayload = {
        embeds:[
          new EmbedBuilder()
          .setTitle("🎮 Submitted Games")
          .setDescription(genDesc)
          .setFooter({text: "Page " + (ogData.page + 1) + " of " + pages.length + ", " + total + " results total"})
          .setTimestamp()
          .setColor("0x7289DA")
        ]
      }
      
      interaction.message.edit({
        embeds: replyPayload['embeds'],
        components: interaction.message.components
      })
      
      interaction.deferUpdate();
      
      await db.set("jamInteractionData-" + ogId, ogData)
      
    }
  }

  if (interaction.isModalSubmit()) {
    const fields = interaction.fields;

    switch (interaction.customId) {
      case "Response_FinishedCreations":
        let creationName = fields.getField("creationName").value;
        let creationDescription = fields.getField("creationDescription").value;
        let creationMedia = fields.getField("creationMedia").value;
        let creationMediaOptional = fields.getField(
          "creationMediaOptional"
        ).value;

        const check = [
          creationName,
          creationDescription,
          creationMedia,
          creationMediaOptional,
        ];

        let err = new EmbedBuilder()
          .setTitle("⚠ Your post was not submitted")
          .setTimestamp()
          .setColor("#FEE75C");

        if (check.some((val) => val.includes("roblox.com/games/"))) {
          err.setDescription(
            "Do not include any links to games or experiences in any field"
          );
          interaction.reply({ embeds: [err], ephemeral: true });
          break;
        }

        if (
          extractUrls(creationMedia) == undefined ||
          (creationMediaOptional != "" &&
            extractUrls(creationMediaOptional) == undefined)
        ) {
          err.setDescription(
            "Either the required or optional media field contained an invalid link. Please try again"
          );
          interaction.reply({ embeds: [err], ephemeral: true });
          break;
        }

        let success = new EmbedBuilder()
          .setTitle("✅ Your post was submitted")
          .setDescription(
            "Your post is now live and viewable by all users.\nIf you want your post removed, create a ticket in <#813074276538253332>"
          )
          .setTimestamp()
          .setColor("#57F287");

        let actions = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("FinishedCreationsLike")
            .setEmoji("👍")
            .setLabel("Upvote")
            .setStyle(3),
          new ButtonBuilder()
            .setCustomId("FinishedCreationsStar")
            .setEmoji("⭐")
            .setLabel("Star")
            .setStyle(1),
          new ButtonBuilder()
            .setCustomId("FinishedCreationsDislike")
            .setEmoji("👎")
            .setLabel("Downvote")
            .setStyle(4)
        );

        let content =
          "Creation Name: " +
          creationName +
          "\nCreator: <@" +
          interaction.member.id +
          ">\n";

        if (creationDescription != "") {
          content = content + "\n" + creationDescription + "\n\n";
        }

        content = content + creationMedia;

        if (creationMediaOptional != "") {
          content = content + "\n" + creationMediaOptional;
        }

        await interaction.channel.send({
          content: content,
          components: [actions],
        });

        await interaction.reply({ embeds: [success], ephemeral: true });
        break;
    }
  }

  if (interaction.isButton()) {
    // With switch/case
    switch (interaction.customId) {
      case "Modal_FinishedCreations":
        const modal = new ModalBuilder()
          .setCustomId("Response_FinishedCreations")
          .setTitle("New Finished Creations Post");

        const creationName = new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("creationName")
            .setRequired(true)
            .setPlaceholder("My Awesome Build")
            .setLabel("Creation Name")
            .setMinLength(3)
            .setMaxLength(32)
            .setStyle(1)
        );

        /*
        const creatorUsername = new ActionRowBuilder()
        .addComponents(
          new TextInputBuilder()
          .setCustomId("creatorUsername")
          .setRequired(true)
          .setPlaceholder("Meex#5640")
          .setLabel("Creator Username")
          .setMinLength(7)
          .setMaxLength(37)
          .setStyle(1)
        )*/

        const creationDescription = new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("creationDescription")
            .setRequired(false)
            .setPlaceholder(
              "A meaningful description of this creation and any other relevant information"
            )
            .setLabel("Description")
            .setMinLength(8)
            .setMaxLength(128)
            .setStyle(2)
        );

        const creationMedia = new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("creationMedia")
            .setRequired(true)
            .setPlaceholder(
              "Link to an image or video of this creation (no game links!)"
            )
            .setLabel("Media")
            .setMinLength(12)
            .setMaxLength(256)
            .setStyle(1)
        );

        const creationMediaOptional = new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("creationMediaOptional")
            .setRequired(false)
            .setPlaceholder(
              "Link to an image or video of this creation (no game links!)"
            )
            .setLabel("Media")
            .setMinLength(12)
            .setMaxLength(256)
            .setStyle(1)
        );

        modal.addComponents(
          creationName,
          creationDescription,
          creationMedia,
          creationMediaOptional
        );

        interaction.showModal(modal);

        break;
    }
  }
};
