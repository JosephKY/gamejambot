# Introduction
This is the RSC Game Jam Bot. This bot can be configured to your liking to make it compatible for any game jam.

The game jam bot makes game jams possible with a TEAM-BASED SYSTEM. Members with at least one skill role can create a team and
invite any member to their team (as long as the member does not have a bad role, like a blacklist). When a team is created by
someone, they become that team's leader and are provided a private team channel. They can invite up to 3 other teammates

The ability to create teams is locked at a certain point and it is at that point that all teams and their teammates should
begin development of their game centered around your provided theme (it's at this point you should announce the theme, so that
teams do not begin development too early).

It's essential that before the game jam is over that every team leader SUBMITS THEIR GAME! This is done with the "/team game"
command. Every team's game can be submitted at any point during development, but it cannot be submitted before the jam begins
or after the jam ends.

# Getting Started

There are two steps to get your game jam set up:

# 1. Configure Bot Variables
You must configure all of the bot variables. They can be found in "events/client/ready.js" and begin at line 12.

Explanation for each bot variable:
- client.skillRoles: An array of all the skill role IDs. You need at least one of them to create a team!
- client.badRoles: An array of bad roles that prevent a member with anyone one of those roles from participating in the game jam. 
- guild: The ID of the guild the game jam bot is being prepared for or tested in.
- client.jamCategory: The channel category that will contain every team's channel. 
- client.jamBackupCategory: The channel category used as a backup if the client.jamCategory has reached the max channels (50)
- client.jamModId: The ID of the role required to use admin and configuration commands for the game jam bot.
- client.jamStaffChannel: The ID of the staff channel where emergency messages are sent.
- client.jamLogId: The ID of the channel where logs are stored
- client.jamRoleId: The ID of the game jam role given to every team member and team leader. 
- client.minTeamNameLength: The minimum character length for custom team names
- client.maxTeamNameLength: The maximum character limit for custom team names
- client.maxTeams: The maximum amount of teams that can exist
- client.swears: An array of words that custom team names cannot contain
- client.strings: Some of the text the bot references. Most text the bot uses is not stored here. If you really need to change
something, it'll be somewhere in the code.

* ONLY CHANGE OTHER BOT CODE IF YOU ARE 100% SURE THAT YOU KNOW WHAT YOU ARE DOING!!! *

# 2. Configure Game Jam
Invite the bot to the server and ensure you have the configured mod role. You have to set up a few
things with the following slash commands:
/team teammod deploy: Deploys the game jam interface for creating teams
/team teammod jamstart: Sets the time the game jam starts. Teams cannot be created or joined after this point
/team teammod jamend: Sets the time the game jam is over. Games cannot be configured, developed, or submitted after this point and team names cannot be configured

Consider exploring the other team and teammod commands. They will be useful later!

# When the Jam Is Over
When the jam ends and it's time for everyone's submissions to be considered, you can view everyone's submitted games with:
/team teammod seegames

You can use that information however you'd like. Personally, I'd recommend creating a poll with Google Forms!

# Notes
1. Anyone with the configured mod role is allowed to participate in the game jam, but can also view any of the existing team channels. It's highly advised that this is either restricted or importance on confidentiality is HIGHLY EMPHASIZED TO STAFF MEMBERS.
2. NEVER EVER MANUALLY DELETE A TEAM CHANNEL! If you need to delete a team permanently, there is a command for it. 
DELETING A TEAM CHANNEL DOES NOT DELETE A TEAM FROM THE BOT DATA!
