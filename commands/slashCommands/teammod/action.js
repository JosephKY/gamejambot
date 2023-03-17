const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder
} = require("discord.js");

module.exports = async function main(client, interaction) {
  async function fetchAllMessages(channel) {
    let messages = [];

    // Create message pointer
    let message = await channel.messages
      .fetch({ limit: 1 })
      .then((messagePage) =>
        messagePage.size === 1 ? messagePage.at(0) : null
      );

    while (message) {
      await channel.messages
        .fetch({ limit: 100, before: message.id })
        .then((messagePage) => {
          messagePage.forEach((msg) => messages.push(msg));

          // Update our message pointer to be last message in page of messages
          message =
            0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
        });
    }

    return messages
  }

  let db = client.db;
  //let debugBuild = new SlashCommandBuilder()
  //.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
  //console.log(debugBuild)

  if (!interaction.inGuild()) {
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor([237, 66, 69])
          .setTitle("❌ Error")
          .setDescription(
            "You can only use this command within the Roblox Studio Community server"
          )
          .setTimestamp(),
      ],
    });
    return;
  }

  let subcommand = interaction.options.getSubcommand();

  if (subcommand == "user") {
    await interaction.deferReply({ ephemeral: true });

    let userOption = interaction.options.getUser("user");
    userOption = userOption.id;
    let userData = await db.get("jamUser-" + userOption);

    if (userData == null) {
      interaction.editReply({
        content: "This user is not associated with any team",
      });
      return;
    }

    if (typeof userData == "boolean" || typeof userData != "string") {
      interaction.editReply({
        content:
          "The data associated with this user is out of date and cannot be viewed. Sorry",
      });
      return;
    }

    let cur = await db.get("jamTeamData-" + userData);
    if (cur == null) {
      interaction.editReply({
        content:
          "The data associated with this user could not be retrieved. Sorry",
      });
      return;
    }

    let compiledInfo = "";

    compiledInfo = compiledInfo + "**Team Leader:** <@" + cur.leaderId + ">\n";

    compiledInfo = compiledInfo + "**Current Teammates:** ";
    cur.teammates.forEach((id) => {
      compiledInfo = compiledInfo + "<@" + id + ">, ";
    });

    compiledInfo = compiledInfo + "\n";

    compiledInfo = compiledInfo + "**Permanent Teammate Record:** ";
    cur.teammatesPerm.forEach((id) => {
      compiledInfo = compiledInfo + "<@" + id + ">, ";
    });
    compiledInfo = compiledInfo + "\n";

    compiledInfo = compiledInfo + "**Invited Members:** ";
    cur.invited.forEach((id) => {
      compiledInfo = compiledInfo + "<@" + id + ">, ";
    });

    compiledInfo = compiledInfo + "\n**Game:** " + cur.game + "\n";

    compiledInfo =
      compiledInfo + "**Team Channel:** <#" + cur.channelId + ">\n";

    compiledInfo =
      compiledInfo +
      "**Created:** <t:" +
      Math.floor(cur.created / 1000) +
      ":F>\n";

    compiledInfo = compiledInfo + "**Team Name:** " + cur.name + "\n";

    //compiledInfo = compiledInfo + "**Status:** " + cur.status + " - " + equivalent[cur.status]

    let debugEmbed = new EmbedBuilder()
      .setTitle("👤 User Team Data")
      .setTimestamp()
      .setColor([153, 170, 181])
      .setDescription(compiledInfo);

    interaction.editReply({
      embeds: [debugEmbed],
    });

    client.logAction(interaction.user, `Viewed team data for user <@${userOption}>`, [254, 230, 92])
  }

  if (subcommand == "delete") {
    async function fetchAllMessages() {
      const channel = client.channels.cache.get("<my-channel-id>");
      let messages = [];

      // Create message pointer
      let message = await channel.messages
        .fetch({ limit: 1 })
        .then((messagePage) =>
          messagePage.size === 1 ? messagePage.at(0) : null
        );

      while (message) {
        await channel.messages
          .fetch({ limit: 100, before: message.id })
          .then((messagePage) => {
            messagePage.forEach((msg) => messages.push(msg));

            // Update our message pointer to be last message in page of messages
            message =
              0 < messagePage.size
                ? messagePage.at(messagePage.size - 1)
                : null;
          });
      }

      console.log(messages); // Print all messages
    }

    await interaction.deferReply({ ephemeral: true });

    if (
      interaction.member.roles.cache.some((role) => client.jamModIds.includes(role.id))
    ) {
      let leaderOption = interaction.options.getUser("leader");
      leaderOption = leaderOption.id;

      if (!leaderOption) {
        interaction.editReply({
          content: "Please fulfill the leader ID option",
        });
        return;
      }

      let cur = await db.get("jamTeamData-" + leaderOption);

      if (cur == null) {
        interaction.editReply({ content: "Team not found", ephemeral: true });
        return;
      }

      let channelId = cur["channelId"];

      let teamGuild = await client.guilds.cache.get(cur.guildId);
      if (!teamGuild) {
        interaction.editReply({
          content: "Error while getting team guild",
        });
        return;
      }

      await interaction.editReply({
        content: "Team deleted successfully",
      });

      if (channelId) {
        let channel = await teamGuild.channels.cache.get(channelId);
        if (channel) {
          await channel.delete();
        }
      }

      let jamRole = await teamGuild.roles.cache.get(client.jamRoleId);

      if (cur != null) {
        let compiledInfo = "";

        compiledInfo = compiledInfo + "**Team Leader:** <@" + cur.leaderId + ">\n";

        compiledInfo = compiledInfo + "**Current Teammates:** ";
        cur.teammates.forEach((id) => {
          compiledInfo = compiledInfo + "<@" + id + ">, ";
        });

        compiledInfo = compiledInfo + "\n";

        compiledInfo = compiledInfo + "**Permanent Teammate Record:** ";
        cur.teammatesPerm.forEach((id) => {
          compiledInfo = compiledInfo + "<@" + id + ">, ";
        });
        compiledInfo = compiledInfo + "\n";

        compiledInfo = compiledInfo + "**Invited Members:** ";
        cur.invited.forEach((id) => {
          compiledInfo = compiledInfo + "<@" + id + ">, ";
        });

        compiledInfo = compiledInfo + "\n**Game:** " + cur.game + "\n";

        compiledInfo =
          compiledInfo + "**Team Channel:** " + cur.channelId + "\n";

        compiledInfo =
          compiledInfo +
          "**Created:** <t:" +
          Math.floor(cur.created / 1000) +
          ":F>\n";

        compiledInfo = compiledInfo + "**Team Name:** " + cur.name + "\n";
        await client.logAction(interaction.user, `Team deleted by <@${interaction.user.id}>\n\n` + compiledInfo, [237, 66, 69])
        

        cur.teammates.forEach(async (mate) => {
          await db.delete("jamUser-" + mate);
          let mmb = await teamGuild.members.cache.get(mate);
          if (mmb && jamRole && mmb.roles.cache.has(client.jamRoleId)) {
            mmb.roles.remove(jamRole);
          }
        });
      }

      await db.pull("jamStatus-" + cur.status, leaderOption);
      await db.pull("jamGames", leaderOption);
      await db.delete("jamTeamData-" + leaderOption);

      let generalData = await db.get("jamGeneral");
      if (generalData.count != undefined) {
        generalData.count = generalData.count + 1;
        await db.set("jamGeneral", generalData);
      }
    } else {
      interaction.editReply({
        content:
          "Teams can only be deleted by moderators. Create a ticket for support",
      });
    }
  }
  if (subcommand == "forcename") {
    await interaction.deferReply({ ephemeral: true });

    if (
      interaction.member.roles.cache.some((role) => client.jamModIds.includes(role.id))
    ) {
      let leaderId = interaction.options.getUser("leader");
      leaderId = leaderId.id;
      let newName = interaction.options.getString("name");

      let cur = await db.get("jamTeamData-" + leaderId);
      if (cur == null) {
        interaction.editReply({ content: "Team not found" });
        return;
      }

      if (newName.length < 3 || newName.length > 50) {
        interaction.editReply({
          content: "Invalid team name. Keep name between 3 and 50 characters",
        });
        return;
      }

      let teamGuild = await client.guilds.cache.get(cur.guildId);
      if (!teamGuild) {
        interaction.editReply({
          content: "Error while getting team guild",
        });
        return;
      }

      let teamChannel = await teamGuild.channels.cache.get(cur["channelId"]);

      if (!teamChannel) {
        interaction.editReply({
          content: "Error while getting team channel",
        });
        return;
      }

      teamChannel.setName(newName);

      interaction.editReply({
        content: "Team name forcefully changed",
      });
      teamChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor([88, 101, 242])
            .setTitle("✍ Name Changed")
            .setDescription("Team name changed to ``" + newName + "``")
            .setTimestamp(),
        ],
      });

      cur["name"] = newName;
      await db.set("jamTeamData-" + leaderId, cur);
      client.logAction(interaction.user, `Forced team <#${await teamChannel.id}> name to ${newName}`, [254, 230, 92])
    }
  }
  if (subcommand == "remove") {
    await interaction.deferReply({ ephemeral: true });

    if (
      interaction.member.roles.cache.some((role) => client.jamModIds.includes(role.id))
    ) {
      let leaderId = interaction.options.getUser("leader");
      leaderId = leaderId.id;
      let removingId = interaction.options.getUser("teammate");
      removingId = removingId.id;

      console.log(removingId);

      let cur = await db.get("jamTeamData-" + leaderId);
      if (cur == null) {
        interaction.editReply({
          content: "Team not found",
        });
        return;
      }

      if (cur.leaderId == removingId) {
        interaction.editReply({
          content:
            "Team leader cannot be removed. Depose the leader first and then remove them, or delete the team",
        });
        return;
      }

      if (!cur.teammates.includes(removingId)) {
        interaction.editReply({
          content: "User not associated with this team",
        });
        return;
      }

      let teamGuild = await client.guilds.cache.get(cur.guildId);
      if (!teamGuild) {
        interaction.editReply({
          content: "Error while getting team guild",
        });
        return;
      }

      let teamChannel = await teamGuild.channels.cache.get(cur.channelId);
      if (!teamChannel) {
        interaction.editReply({
          content: "Error while getting team channel",
        });
        return;
      }

      let newpSet = true;

      teamChannel.permissionOverwrites
        .edit(teamGuild.members.cache.get(removingId), {
          ViewChannel: null,
        })
        .catch(() => {
          newpSet = false;
        });

      if (!newpSet) {
        interaction.editReply({
          content: "Error while configuring channel permissions",
        });
        return;
      }

      teamChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor([237, 66, 69])
            .setTitle("💥 Teammate Removed")
            .setDescription(
              "Teammate <@" +
              removingId +
              "> was removed from the team by server staff"
            )
            .setTimestamp(),
        ],
      });

      cur.teammates.splice(cur.teammates.indexOf(removingId), 1);
      await db.set("jamTeamData-" + leaderId, cur);
      await db.delete("jamUser-" + removingId);

      let mmb = teamGuild.members.cache.get(removingId);
      let jamRole = teamGuild.roles.cache.get(client.jamRoleId);
      if (mmb && jamRole && mmb.roles.cache.has(client.jamRoleId)) {
        mmb.roles.remove(jamRole);
      }

      interaction.editReply({
        content: "User removed from team successfully",
      });

      client.logAction(interaction.user, `Removed teammate <@${removingId}> from team <#${teamChannel.id}>`, [254, 230, 92])
    } else {
      interaction.editReply({
        content:
          "Teammates can only be removed by moderators. Create a ticket for support",
      });
    }
  }
  if (subcommand == "depose") {
    await interaction.deferReply({ ephemeral: true });

    if (
      interaction.member.roles.cache.some((role) => client.jamModIds.includes(role.id))
    ) {
      let leaderOption = interaction.options.getUser("leader");
      leaderOption = leaderOption.id;
      let newLeader = interaction.options.getUser("teammate");
      newLeader = newLeader.id;

      let cur = await db.get("jamTeamData-" + leaderOption);
      if (cur == null) {
        interaction.editReply({
          content: "Team not found",
        });
        return;
      }

      if (leaderOption.trim() == newLeader.trim()) {
        interaction.editReply({
          content: "Cannot transfer leadership to the current leader",
        });
        return;
      }

      if (!cur.teammates.includes(newLeader)) {
        interaction.editReply({
          content:
            "New leader ID belongs to a user not associated with this team, depose failed",
        });
        return;
      }

      let teamGuild = await client.guilds.cache.get(cur.guildId);
      if (!teamGuild) {
        interaction.editReply({
          content: "Couldn't retrieve the team guild",
        });
        return;
      }

      let teamChannel = await teamGuild.channels.cache.get(cur["channelId"]);
      if (!teamChannel) {
        interaction.editReply({
          content: "Couldn't retrieve the team channel",
        });
        return;
      }

      interaction.editReply({
        content:
          "Team leadership forcefully transferred from <@" +
          leaderOption +
          "> to <@" +
          newLeader +
          ">",
      });

      teamChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTimestamp()
            .setColor([88, 101, 242])
            .setTitle("👑 Leadership Transferred")
            .setDescription(
              "Team leadership was alternatively transferred from <@" +
              leaderOption +
              "> to <@" +
              newLeader +
              ">"
            ),
        ],
      });

      cur["leaderId"] = newLeader;
      await db.set("jamTeamData-" + newLeader, cur);
      await db.delete("jamTeamData-" + leaderOption);
      //await db.pull("jamStatus-" + cur["status"], leaderOption)
      //await db.push("jamStatus-" + cur["status"], newLeader)
      if (leaderOption in (await db.get("jamGames"))) {
        db.pull("jamGames", leaderOption);
        db.push("jamGames", newLeader);
      }

      cur.teammates.forEach(async (mate) => {
        await db.set("jamUser-" + mate, newLeader);
      });

      client.logAction(interaction.user, `Forced team leader transfer from <@${leaderOption}> to <@${newLeader}>`, [254, 230, 92])
    }
  }
  if (subcommand == "team") {
    await interaction.deferReply({ ephemeral: true });

    if (
      interaction.member.roles.cache.some((role) => client.jamModIds.includes(role.id))
    ) {
      let leaderId = interaction.options.getUser("leader");
      leaderId = leaderId.id;
      let cur = await db.get("jamTeamData-" + leaderId);
      if (cur == null) {
        interaction.editReply({ content: "Team not found" });
        return;
      }

      let compiledInfo = "";

      compiledInfo =
        compiledInfo + "**Team Leader**: <@" + cur.leaderId + ">\n";

      compiledInfo = compiledInfo + "**Current Teammates:** ";
      cur.teammates.forEach((id) => {
        compiledInfo = compiledInfo + "<@" + id + ">, ";
      });

      compiledInfo = compiledInfo + "\n";

      compiledInfo = compiledInfo + "**Permanent Teammate Record:** ";
      cur.teammatesPerm.forEach((id) => {
        compiledInfo = compiledInfo + "<@" + id + ">, ";
      });
      compiledInfo = compiledInfo + "\n";

      compiledInfo = compiledInfo + "**Invited Members:** ";
      cur.invited.forEach((id) => {
        compiledInfo = compiledInfo + "<@" + id + ">, ";
      });

      compiledInfo = compiledInfo + "\n**Game:** " + cur.game + "\n";

      compiledInfo =
        compiledInfo + "**Team Channel:** <#" + cur.channelId + ">\n";

      compiledInfo =
        compiledInfo +
        "**Created:** <t:" +
        Math.floor(cur.created / 1000) +
        ":F>\n";

      compiledInfo = compiledInfo + "**Team Name:** " + cur.name + "\n";

      //compiledInfo = compiledInfo + "**Status:** ``ID: " + cur.status + "`` - " + equivalent[cur.status]

      let debugEmbed = new EmbedBuilder()
        .setTitle("🤝 Team Data")
        .setTimestamp()
        .setColor([153, 170, 181])
        .setDescription(compiledInfo);

      interaction.editReply({
        embeds: [debugEmbed],
      });

      client.logAction(interaction.user, `Viewed team data for team <#${cur.channelId}>`, [254, 230, 92])
    }
  }

  if (subcommand == "deploy") {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.inGuild()) {
      interaction.editReply({
        content: "Game jam interfaces must be deployed in a server",
      });
      return;
    }

    let title = interaction.options.getString("title");
    let desc = interaction.options.getString("description");

    if (title.length > 255) {
      interaction.editReply({
        content: "Interface title can only have up to 255 characters",
      });
      return;
    }

    if (title.length > 4000) {
      interaction.editReply({
        content: "Interface description can only have up to 4000 characters",
      });
      return;
    }

    let interfacePayload = {
      embeds: [
        new EmbedBuilder()
          .setTitle(title)
          .setColor([114, 137, 218])
          .setDescription(desc),
      ],
      components: [
        new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setLabel("Create Team")
            .setEmoji("🚀")
            .setStyle(1)
            .setCustomId("jamCreateTeam"),
        ]),
      ],
    };

    interaction.channel.send(interfacePayload);

    interaction.editReply({
      content: "Game jam interface deployed successfully",
    });

    client.logAction(interaction.user, `Deployed team creation interface in <#${interaction.channel.id}>`)
  }

  if (subcommand == "jamstart") {
    await interaction.deferReply({ ephemeral: true });

    let time = interaction.options.getInteger("time");

    let cur = await db.get("jamGeneral");
    cur.jamstart = time;
    await db.set("jamGeneral", cur);

    interaction.editReply({
      content:
        "Jam has been set to start at <t:" + Math.floor(time / 1000) + ":F>",
    });

    client.logAction(interaction.user, `Set game jam to start at <t:${Math.floor(time / 1000)}:F>`, [254, 230, 92])
  }

  if (subcommand == "general") {
    await interaction.deferReply({ ephemeral: true });

    let cur = await db.get("jamGeneral");

    if (cur == null) {
      interaction.editReply({
        content: "Failed to get general data",
      });
      return;
    }
    console.log(cur["jamend"]);
    let desc =
      "Jam Starts: <t:" +
      Math.floor(cur["jamstart"] / 1000) +
      ":F>\nJam Ends: <t:" +
      Math.floor(cur["jamend"] / 1000) +
      ":F>\nNew Teams Available: " +
      cur["count"];

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("📄 General Data")
          .setColor([153, 170, 181])
          .setTimestamp()
          .setDescription(desc),
      ],
    });
  }

  if (subcommand == "jamend") {
    await interaction.deferReply({ ephemeral: true });

    let time = interaction.options.getInteger("time");

    let cur = await db.get("jamGeneral");
    cur.jamend = time;
    await db.set("jamGeneral", cur);

    interaction.editReply({
      content:
        "Jam has been set to end at <t:" + Math.floor(time / 1000) + ":F>",
    });

    client.logAction(interaction.user, `Set game jam to end at <t:${Math.floor(time / 1000)}:F>`, [254, 230, 92])
  }

  if (subcommand == "seeall") {
    await interaction.deferReply();

    let status = interaction.options.getString("status");
    let data = await db.get("jamStatus-" + status);
    let pages = [];
    let page = [];
    let total = 0;
    let max = 20;

    if (data == null) {
      interaction.editReply({
        content: "Failed to get teams data",
      });
      return;
    }

    if (!(data.constructor === Array)) {
      interaction.editReply({
        content: "Data provided is corrupted",
      });
      return;
    }

    if (data.length == 0) {
      interaction.editReply({
        content: "No teams with this status",
      });
      return;
    }

    data.forEach((info) => {
      total = total + 1;
      page.push(info);
      if (page.length == max) {
        pages.push(page);
        page = [];
      }
    });

    if (page.length > 0) {
      pages.push(page);
    }

    let interactionDataPayload = {
      total: total,
      pages: pages,
      page: 0,
      max: max,
    };

    let firstPage = pages[0];
    let genDesc = "";

    let gen = await new Promise((resolve, reject) => {
      firstPage.forEach(async (info) => {
        //console.log(info)
        let cur = await db.get("jamTeamData." + info);
        genDesc =
          genDesc + "Leader <@" + info + "> in <#" + cur.channelId + ">\n";
        //genDesc = genDesc + "Leader <@" + info + ">\n"
      });
    });

    console.log(genDesc);
    interaction.editReply("logged...");
    return;

    let replyPayload = {
      embeds: [
        new EmbedBuilder()
          .setTitle("🔍 Search Results")
          .setDescription(genDesc)
          .setFooter({
            text: "Page 1 of " + pages.length + ", " + total + " results total",
          })
          .setTimestamp()
          .setColor([114, 137, 218]),
      ],
    };

    if (pages.length > 1) {
      replyPayload["components"] = [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("⏮ First")
            .setStyle(2)
            .setCustomId("jSV_First-" + interaction.id),

          new ButtonBuilder()
            .setLabel("⏪ Previous")
            .setStyle(2)
            .setCustomId("jSV_Previous-" + interaction.id),

          new ButtonBuilder()
            .setLabel("⏩ Next")
            .setStyle(2)
            .setCustomId("jSV_Next-" + interaction.id),

          new ButtonBuilder()
            .setLabel("⏭ Last")
            .setStyle(2)
            .setCustomId("jSV_Last-" + interaction.id)
        ),
      ];
    }

    await db.set(
      "jamInteractionData-" + interaction.id,
      interactionDataPayload
    );
    console.log(await db.get("jamInteractionData-" + interaction.id));

    interaction.editReply(replyPayload);
  }

  if (subcommand == "seegames") {
    await interaction.deferReply();

    let data = await db.get("jamGames");
    let pages = [];
    let page = [];
    let total = 0;
    let max = 15;

    if (data == null) {
      interaction.editReply({
        content: "Failed to get teams data",
      });
      return;
    }

    if (!(data.constructor === Array)) {
      interaction.editReply({
        content: "Data provided is corrupted",
      });
      return;
    }

    if (data.length == 0) {
      interaction.editReply({
        content: "No teams with set games",
      });
      return;
    }

    data.forEach((info) => {
      total = total + 1;
      page.push(info);
      if (page.length == max) {
        pages.push(page);
        page = [];
      }
    });

    if (page.length > 0) {
      pages.push(page);
    }

    let interactionDataPayload = {
      total: total,
      pages: pages,
      page: 0,
      max: max,
    };

    let firstPage = pages[0];
    let genDesc = "";
    /*
    let genDescP = new Promise((resolve, reject) => {
      firstPage.forEach(async lId=>{
        let cur = await db.get("jamTeamData-" + lId)
        if (cur==null) {
          return
        }
        genDesc = genDesc + "Leader <@" + lId + "> - " + cur.game + "\n"
      })
      resolve()
    })
    
    let generate = await genDescP.then(()=>{})
    */
    /*
    await firstPage.forEach(async info=>{
      //console.log(info)
      //let cur = await db.get("jamTeamData-" + info)
      //genDesc = genDesc + "Leader <@" + info + "> - " + cur.game + "\n"
      genDesc = genDesc + "Leader <@" + info + ">\n"
    })
    */

    for await (const info of firstPage) {
      let cur = await db.get("jamTeamData-" + info);
      if (cur == null) {
        continue;
      }
      genDesc = genDesc + "Leader <@" + info + "> - " + cur.game + "\n";
    }

    let replyPayload = {
      embeds: [
        new EmbedBuilder()
          .setTitle("🎮 Submitted Games")
          .setDescription(genDesc)
          .setFooter({
            text: "Page 1 of " + pages.length + ", " + total + " results total",
          })
          .setTimestamp()
          .setColor([114, 137, 218]),
      ],
    };

    if (pages.length > 1) {
      replyPayload["components"] = [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("⏮ First")
            .setStyle(2)
            .setCustomId("jGV_First-" + interaction.id),

          new ButtonBuilder()
            .setLabel("⏪ Previous")
            .setStyle(2)
            .setCustomId("jGV_Previous-" + interaction.id),

          new ButtonBuilder()
            .setLabel("⏩ Next")
            .setStyle(2)
            .setCustomId("jGV_Next-" + interaction.id),

          new ButtonBuilder()
            .setLabel("⏭ Last")
            .setStyle(2)
            .setCustomId("jGV_Last-" + interaction.id)
        ),
      ];
    }

    await db.set(
      "jamInteractionData-" + interaction.id,
      interactionDataPayload
    );
    console.log(await db.get("jamInteractionData-" + interaction.id));

    interaction.editReply(replyPayload);
    client.logAction(interaction.user, `Viewed all submitted game jam games`, [254, 230, 92])
  }

  if (subcommand == "resetinv") {
    await interaction.deferReply();
    let leaderId = interaction.options.getUser("leader").id;
    let cur = await db.get("jamTeamData-" + leaderId);
    if (cur == null) {
      interaction.editReply("Failed to get team data");
      return;
    }

    cur.invited = [];
    await db.set("jamTeamData-" + leaderId, cur);
    interaction.editReply("Invites reset");
    client.logAction(interaction.user, `Reset invites for team <#${cur.channelId}>`, [254, 230, 92])
  }

  if (subcommand == "addteam") {
    await interaction.deferReply();
    let leaderId = interaction.options.getUser("leader").id;
    let cur = await db.get("jamTeamData-" + leaderId);
    let usr = await db.get("jamUser-" + leaderId);
    let general = await db.get("jamGeneral");
    if (cur != null || usr != null) {
      interaction.editReply(
        "Leader selected is already participating in a team"
      );
      return;
    }

    if (general.count == undefined) {
      general.count = client.maxTeams
    }

    if (general == null) {
      interaction.editReply("Fatal: couldn't read/write important data");
      return;
    }

    if (general.count <= 0) {
      //interaction.editReply("Couldn't force create team: max teams exist");
      //return;
    }

    const { PermissionsBitField } = require("discord.js");
    let modRoles = []
    client.jamModIds.forEach(mid => {
      let modRole = interaction.guild.roles.cache.find(
        (r) => r.id === mid
      );
      if (!modRole) return
      modRoles.push(modRole)
    })
    if (modRoles.length == 0) {
      interaction.editReply(
        "Fatal: couldn't set permissions for new channel, team not created"
      );
      return;
    }

    general.count = general.count - 1;

    let channelName = "Team " + interaction.options.getUser("leader").username;
    channelName = channelName.substring(0, 100);

    let teamChannel = await interaction.guild.channels.create({
      name: channelName,
      type: 0, // text
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });

    let defaultPerms = [
      // Allow only the team creator and mods to view the new channel
      {
        id: interaction.guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: leaderId,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
    ];

    modRoles.forEach(mr => {
      defaultPerms.push({
        id: mr.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
      })
    })

    teamChannel.setParent(client.jamCategory).catch(() => {
      console.log("MAX CATEGORY CHANNELS REACHED PLEASE FIX");
    });

    teamChannel.permissionOverwrites.set(defaultPerms, "Default team perms");

    let infoPayload = {
      embeds: [
        new EmbedBuilder()
          .setTitle("🎉 Welcome")
          .setDescription(
            "Welcome to your team channel! You can get started by checking out the following slash commands:\n\n</team summary:1030918955822485606> - View a summary of your team's information\n</team help:1030918955822485606> - View help and information for a specific issue\n</team invite:1030918955822485606> - Invite a member in the server to join your team. This can only be done once per member\n</team game:1030918955822485606> - Set the Roblox experience URL associated with your game\n</team name:1030918955822485606> - Set the name for your team\n\nWithdrawing, deleting your team, transferring leadership, or removing teammates require moderator approval. To get approval, create a ticket in <#813074276538253332> and talk to a moderator"
          )
          .setColor([88, 101, 242])
          .setTimestamp(),
        new EmbedBuilder()
          .setTitle("👑 Current Leader")
          .setColor([241, 196, 15])
          .setDescription("The leader of this team is <@" + leaderId + ">"),
        //new EmbedBuilder()
        //  .setTitle("❗ Important")
        //  .setColor([237, 66, 69])
        //  .setDescription("Your team status must be set to '✅ Submitted' with </team status:1029237145979846707> by the time the jam is over. Setting your status to this submits your project, and not submitting your project will most likely result in it being ignored.")
        new EmbedBuilder()
          .setTitle("❗ Important")
          .setColor([237, 66, 69])
          .setDescription(
            "This team was forcefully created by staff member <@" +
            interaction.user.id +
            ">"
          ),
      ],
    };

    teamChannel.send(infoPayload);

    let dataPayload = {
      name: channelName,
      channelId: teamChannel.id,
      guildId: interaction.guild.id,
      leaderId: leaderId,
      game: undefined,
      invited: [],
      teammates: [leaderId],
      teammatesPerm: [leaderId],
      created: Date.now(),
      status: "0",
    };

    await db.set("jamTeamData-" + leaderId, dataPayload);
    await db.set("jamUser-" + leaderId, leaderId);
    await db.set("jamGeneral", general);

    let leaderMember = await interaction.guild.members.fetch(leaderId);

    let jamRole = await interaction.guild.roles.cache.get(client.jamRoleId);
    if (jamRole != undefined && leaderMember != undefined) {
      leaderMember.roles.add(jamRole).catch(() => {
        console.log("couldnt forcefully give game jam role");
      });
    }

    interaction.editReply("Team forcefully created");

    client.logAction(interaction.user, `Forcefully created team <#${teamChannel.id}> with leader <@${leaderId}>`, [254, 230, 92])
  }

  if (subcommand == "addmate") {
    await interaction.deferReply();
    let leaderId = interaction.options.getUser("leader").id;
    let mateId = interaction.options.getUser("teammate").id;
    let cur = await db.get("jamTeamData-" + leaderId);
    let matedata = await db.get("jamUser-" + mateId);
    if (cur == null) {
      interaction.editReply("Failed to get team data");
      return;
    }

    if (matedata != null) {
      interaction.editReply("Teammate selected is already in a team");
      return;
    }

    if (cur.teammates.length == 4) {
      interaction.editReply("Team already has the max 4 teammates");
      return;
    }

    let forcedMember = await interaction.guild.members.fetch(mateId);
    if (!forcedMember) {
      interaction.editReply("Couldn't load forced teammate member data");
      return;
    }

    let teamChannel = await interaction.guild.channels.cache.get(cur.channelId);
    if (!teamChannel) {
      interaction.editReply("Couldn't load team channel");
      return;
    }

    let jamRole = await interaction.guild.roles.cache.get(client.jamRoleId);
    if (jamRole != undefined) {
      forcedMember.roles.add(jamRole);
    }

    teamChannel.permissionOverwrites.edit(
      interaction.options.getUser("teammate"),
      {
        ViewChannel: true,
      }
    );

    cur.teammates.push(mateId);
    cur.teammatesPerm.push(mateId);

    await db.set("jamTeamData-" + leaderId, cur);
    await db.set("jamUser-" + mateId, leaderId);

    teamChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("❗ Teammate Added")
          .setColor([237, 66, 69])
          .setDescription(
            "Teammate <@" +
            mateId +
            "> was forcefully added to the teammate by staff member <@" +
            interaction.user.id +
            ">"
          ),
      ],
    });

    interaction.editReply("Teammate forcefully added");
    client.logAction(interaction.user, `Forcefully added new teammate <@${mateId}> to <#${await teamChannel.id}>`, [254, 230, 92])
  }

  if (subcommand == "archive") {
    await interaction.deferReply();
    let teammateId = interaction.options.getUser("user").id;
    let leaderId = await db.get("jamUser-" + teammateId)

    if (leaderId == null) {
      await interaction.editReply("User specified is not in a team")
      return
    }

    let cur = await db.get("jamTeamData-" + leaderId)

    if (cur == null) {
      await interaction.editReply("Failed to get team data")
      return
    }

    let channel = await interaction.guild.channels.cache.get(cur.channelId)

    if (!channel) {
      await interaction.editReply("Failed to get team channel")
      return
    }

    let gen = {
      team: cur,
      messages: []
    }

    let template = {
      tag: undefined,
      bot: undefined,
      username: undefined,
      discriminator: undefined,
      nickname: undefined,
      userid: undefined,
      profile_picture: undefined,
      content: undefined,
      createdAt: undefined,
      createdTimestamp: undefined,
      id: undefined
    }

    let messages = (await fetchAllMessages(channel))

    for (var message of messages) {
      let insert = Object.assign({}, template)
      insert.tag = message.author.tag
      insert.bot = message.author.bot
      insert.username = message.author.username
      insert.discriminator = message.author.discriminator
      insert.userid = message.author.id
      insert.profile_picture = await message.author.avatarURL()
      insert.content = message.content
      insert.createdAt = message.createdAt
      insert.createdTimestamp = message.createdTimestamp
      insert.id = message.id

      let attachments = []

      for (var attachment of message.attachments) {
        let compiled = {}
        compiled.contentType = attachment.contentType
        compiled.description = attachment.description
        compiled.id = attachment.id
        compiled.spoiler = attachment.spoiler
        compiled.url = attachment.url
        compiled.size = attachment.size

        attachments.push(compiled)
      }

      insert.attachments = attachments

      let embeds = []

      message.embeds.forEach(embed => {
        embeds.push(embed.data)
      })

      insert.embeds = embeds

      gen.messages.push(insert)

    }

    const fs = require("fs")

    let insertSafe = JSON.stringify(gen)
    await fs.appendFile(leaderId + ".json", insertSafe, () => { })


    await interaction.editReply({ content: "Here is your archive for the team with channel <#" + cur.channelId + ">:", files: [leaderId + ".json"] })
    await fs.rm(leaderId + ".json", () => { })

    client.logAction(interaction.user, `Archived team <#${cur.channelId}> in <#${await interaction.channel.id}>`, [254, 230, 92])
  }
};
