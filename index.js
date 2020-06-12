/*jshint esversion: 6 */

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");

var messages = 0;
var commands = 0;

var exec = require('child_process').exec;

function execute(command) {
	exec(command, function (error, stdout, stderr) {
		console.log(stdout);
	});
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	var server = client.guilds.get("479194770972082176");
});

client.on('message', msg => {
	if (msg.content === "ping") {
		msg.channel.send("pong (☞ﾟヮﾟ)☞");
	}
});
/*
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	let ch = client.channels.get(config.announce);
	ch.setTopic("Last restart: " + client.readyAt + " - Version: v" + config.ver);
	client.user.setActivity(config.activity, {
		type: config.activityType
	});
	ch.send({
		embed: {
			color: 0x31d400,
			author: {
				name: client.user.username,
				icon_url: client.user.avatarURL
			},
			title: "Bot online!",
			description: (`Version: ${config.ver} (use %changelog to see what's new)`),
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: "Automated message"
			}
		}
	});
	var server = client.guilds.get("458499904059342848");
});

client.on('guildMemberAdd', mem => {
	let ch = client.channels.get(config.join);
	ch.send({
		embed: {
			color: 0x3E48A1,
			author: {
				name: mem.user.username,
				icon_url: mem.user.avatarURL
			},
			title: "Welcome to the server, " + mem.user.username + "!",
			description: "Welcome to the Civil Conservatives! Please read the rules before requesting access. To request access, start a ticket by sending a message with the following details: **!r** *<real name> <year level> <school>.",
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: "This message will auto-delete after 2min"
			}
		}
	});
});

client.on('message', msg => {
	try {
		messages = messages + 1;
		if (msg.content === '%stat') {
			commands = commands + 1;
			msg.channel.send({
				embed: {
					color: 3447003,
					author: {
						name: "Bot Statistics (since last restart)",
						icon_url: client.user.avatarURL
					},
					fields: [{
							name: "Messages",
							value: messages
						},
						{
							name: "Commands",
							value: commands
						},
						{
							name: "Server",
							value: msg.channel.guild.name
						},
						{
							name: "Created by",
							value: "MrConorAE"
						},
						{
							name: "Technical Info",
							value: "Programmed in node.js and discord.js. Hosted on a Raspberry Pi."
						},
						{
							name: "Version",
							value: "v" + config.ver
						},
						{
							name: "Uptime (min)",
							value: (client.uptime * 0.00001667).toString()
						}
					],
					timestamp: new Date(),
					footer: {
						icon_url: msg.author.avatarURL,
						text: "Requested by " + msg.author.username
					}
				}
			});
		} else if (msg.content === '%changelog') {
			commands = commands + 1;
			msg.channel.send({
				embed: {
					color: 3447003,
					author: {
						name: "Changelog",
						icon_url: client.user.avatarURL
					},
					fields: [{
							name: "Current version",
							value: config.ver
						},
						{
							name: "Changes in this version",
							value: "Added some goodies."
						},
						{
							name: "Known issues",
							value: "*None*"
						},
						{
							name: "To report any new bugs",
							value: "Contact **@MrConorAE** or a **@Technician**"
						},
					],
					timestamp: new Date(),
					footer: {
						icon_url: msg.author.avatarURL,
						text: "Requested by " + msg.author.username
					}
				}
			});
		} else if (msg.content === '%help' || msg.content === 'SmartBot') {
			commands = commands + 1;
			msg.channel.send("helo");
			msg.channel.send({
				embed: {
					color: 3447003,
					author: {
						name: "Help",
						icon_url: client.user.avatarURL
					},
					fields: [{
							name: "Moderation",
							value: "%kick <user>, %ban <user>"
						},
						{
							name: "User Management",
							value: "%mute <@user>, %timemute <hhmm> <@user>, %release <@user>, %allowobs <@user>, %allowmem <@user>, %donn, %hath, %barak, %syme"
						},
						{
							name: "Channel Management",
							value: "%clear <messages>"
						},
						{
							name: "Bot Information",
							value: "%stat, %changelog"
						},
						{
							name: "Polls",
							value: "%poll-b, %poll-2, %poll-5"
						},
						{
							name: "If the bot does not respond:",
							value: "Ping **@MrConorAE** or a **@Technician** and we will try to fix it as soon as possible."
						}
					],
					timestamp: new Date(),
					footer: {
						icon_url: msg.author.avatarURL,
						text: "Requested by " + msg.author.username
					}
				}
			});
		} else if (msg.content.startsWith('%clear') === true) {
			if (msg.content === '%clear' || msg.content === '%clear ') {
				msg.channel.send(msg.author.username + " is the big brain.\n*I need to know how many messages to clear.*");
			} else if (msg.member.roles.has(config.authRole)) {
				msg.channel.bulkDelete(msg.content.substr(7));
				msg.channel.send("Foof! " + msg.content.substr(7) + " messages are now no more.");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0x31d400,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "Cleared messages",
						description: msg.author.username + " cleared messages in " + msg.channel.name,
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Done by " + msg.author.username
						}
					}
				});
			} else if ((msg.member.roles.has(config.technician)) && (msg.content.substr(7) <= 5)) {
				msg.channel.bulkDelete(msg.content.substr(7));
				msg.channel.send("Foof! " + msg.content.substr(7) + " messages are now no more.");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0x31d400,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "Cleared messages",
						description: msg.author.username + " cleared messages in " + msg.channel.name,
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Done by " + msg.author.username
						}
					}
				});
			} else {
				msg.channel.send("No. \n*" + msg.author.username + " doesn't have permission to clear messages.*");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0xd4cc00,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "User unauthorised",
						description: msg.author.username + " tried to clear messages in " + msg.channel.name,
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Attempted by " + msg.author.username
						}
					}
				});
			}
		} else if (msg.content.startsWith('%mood') === true) {
			var mood = msg.content.substr(8);
			if (msg.content === '%mood' || msg.content === '%mood ') {
				msg.channel.send(msg.author.username + " is the big brain.\n*You need to tell me what to change my mood to.*");
			} else if (msg.member.roles.has(config.authRole) || msg.member.roles.has(config.technician)) {
				var action = msg.content.substr(6, 1).toUpperCase();
				var actionParsed;
				if (action === "W") {
					actionParsed = "WATCHING";
				} else if (action === "P") {
					actionParsed = "PLAYING";
				} else if (action === "S") {
					actionParsed = "STREAMING";
				} else if (action === "L") {
					actionParsed = "LISTENING";
				} else {
					msg.channel.send("That isn't right! Please provide a valid action type.");
				}
				msg.channel.send("Mood changed to " + mood + ".");
				client.user.setActivity(mood, {
					type: actionParsed
				});
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0x31d400,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "Changed mood",
						description: msg.author.username + " changed my mood to " + mood,
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Done by " + msg.author.username
						}
					}
				});
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't important enough. (*User unauthorised*)");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0xd4cc00,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "User unauthorised",
						description: msg.author.username + " tried to change my mood to " + mood,
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Attempted by " + msg.author.username
						}
					}
				});
			}
		} else if (msg.content === "Bad Veric." || msg.content === "Bad bot.") {
			msg.channel.send("Bad human.");
		} else if (msg.content === "%nsfw") {
			msg.channel.send("You dirty child. Go forth and post porn, " + msg.author.username + ".");
			let role = msg.guild.roles.get(config.nsfw);
			msg.member.addRole(role);
		} else if (msg.content.startsWith('%kick')) {
			commands = commands + 1;
			if (msg.member.roles.has(config.authRole)) {
				const user = msg.mentions.users.first();
				if (user) {
					// Now we get the member from the user
					const member = msg.guild.member(user);
					// If the member is in the guild
					if (member) {
						member.kick('Kicked by Veric, becuse I was told to kick them.').then(() => {
							// We let the message author know we were able to kick the person
							msg.channel.send("Well, that's one less " + msg.mentions.users.first() + " in here.");
							let ch = client.channels.get(config.announce);
							ch.send({
								embed: {
									color: 0x31d400,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									title: "Kicked",
									description: msg.author.username + " kicked " + msg.mentions.users.first(),
									timestamp: new Date(),
									footer: {
										icon_url: client.user.avatarURL,
										text: "Done by " + msg.author.username
									}
								}
							});
						}).catch(err => {
							// An error happened
							// This is generally due to the bot not being able to kick the member,
							// either due to missing permissions or role hierarchy
							msg.channel.send("I couldn't kick " + msg.mentions.users.first() + ". Why bother? (*Bot permissions error*)");
							// Log the error
							console.error(err);
						});
					} else {
						// The mentioned user isn't in this guild
						msg.channel.send("Why are you trying to kick " + msg.mentions.users.first() + " if they're not here? (*User not found*)");
					}
					// Otherwise, if no user was mentioned
				} else {
					msg.channel.send("Oh well done " + msg.author.username + ", you forgot to tell me who to kick. (*Missing argument*)");
				}
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't important enough. (*User unauthorised*)");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0xd4cc00,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "User unauthorised",
						description: msg.author.username + " tried to kick " + msg.mentions.users.first(),
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Attempted by " + msg.author.username
						}
					}
				});
			}
		} else if (msg.content.startsWith('%ban')) {
			commands = commands + 1;
			if (msg.member.roles.has(config.authRole)) {
				const user = msg.mentions.users.first();
				if (user) {
					// Now we get the member from the user
					const member = msg.guild.member(user);
					// If the member is in the guild
					if (member) {
						member.ban('Banned by Veric, becuse I was told to ban them.').then(() => {
							// We let the message author know we were able to kick the person
							msg.channel.send("Well, that's one less " + msg.mentions.users.first() + " in here for a while.");
							let ch = client.channels.get(config.announce);
							ch.send({
								embed: {
									color: 0x31d400,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									title: "Banned",
									description: msg.author.username + " banned " + msg.mentions.users.first(),
									timestamp: new Date(),
									footer: {
										icon_url: client.user.avatarURL,
										text: "Done by " + msg.author.username
									}
								}
							});
						}).catch(err => {
							// An error happened
							// This is generally due to the bot not being able to kick the member,
							// either due to missing permissions or role hierarchy
							msg.channel.send("I couldn't ban " + msg.mentions.users.first() + ". Why bother? (*Bot permissions error*)");
							// Log the error
							console.error(err);
						});
					} else {
						// The mentioned user isn't in this guild
						msg.channel.send("Why are you trying to ban " + msg.mentions.users.first() + " if they're not here? (*User not found*)");
					}
					// Otherwise, if no user was mentioned
				} else {
					msg.channel.send("Oh well done " + msg.author.username + ", you forgot to tell me who to ban. (*Missing argument*)");
				}
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't important enough. (*User unauthorised*)");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0xd4cc00,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "User unauthorised",
						description: msg.author.username + " tried to ban " + msg.mentions.users.first(),
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Attempted by " + msg.author.username
						}
					}
				});
			}
		} else if (msg.content.startsWith('%imprison')) {
			commands = commands + 1;
			if (msg.member.roles.has(config.authRole)) {
				const user = msg.mentions.users.first();
				if (user) {
					// Now we get the member from the user
					const member = msg.guild.member(user);
					// If the member is in the guild
					if (member) {
						let prisoner = msg.guild.roles.get(config.prisoner);
						member.setRoles([prisoner]).then(() => {
							// We let the message author know we were able to allow the person
							msg.channel.send("Detention, " + msg.mentions.users.first() + " - see me after this.");
							let ch = client.channels.get(config.announce);
							ch.send({
								embed: {
									color: 0x31d400,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									title: "Imprisoned",
									description: msg.author.username + " imprisoned " + msg.mentions.users.first(),
									timestamp: new Date(),
									footer: {
										icon_url: client.user.avatarURL,
										text: "Done by " + msg.author.username
									}
								}
							});
							let jail = client.channels.get(config.jail);
							jail.send(user.username + ", you have been imprisoned!");
						}).catch(err => {
							// An error happened
							// This is generally due to the bot not being able to add the member,
							// either due to missing permissions or role hierarchy
							msg.channel.send("Hmmm, imprisoning " + msg.mentions.users.first() + " didnt seem to work. (*Bot permissions error*)");
							// Log the error
							console.error(err);
						});
					} else {
						// The mentioned user isn't in this guild
						msg.channel.send("Why are you trying to imprison " + msg.mentions.users.first() + " if they don't exist? (*User not found*)");
					}
					// Otherwise, if no user was mentioned
				} else {
					msg.channel.send("Oh well done " + msg.author.username + ", you forgot to tell me who to imprison. (*Missing argument*)");
				}
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't important enough. (*User unauthorised*)");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0xd4cc00,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "User unauthorised",
						description: msg.author.username + " tried to imprison " + msg.mentions.users.first(),
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Attempted by " + msg.author.username
						}
					}
				});
			}
		} else if (msg.content.startsWith('%temprison')) {
			commands = commands + 1;
			if (msg.member.roles.has(config.authRole)) {
				const user = msg.mentions.users.first();
				const hours = msg.content.substr(11, 2);
				const mins = msg.content.substr(13, 2);
				if (user) {
					// Now we get the member from the user
					const member = msg.guild.member(user);
					// If the member is in the guild
					if (member) {
						let prisoner = msg.guild.roles.get(config.prisoner);
						member.setRoles([prisoner]).then(() => {
							// We let the message author know we were able to allow the person
							msg.channel.send("Go and wait outside the class, " + msg.mentions.users.first() + "!");
							let ch = client.channels.get(config.announce);
							ch.send({
								embed: {
									color: 0x31d400,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									title: "Temporarily imprisoned",
									description: msg.author.username + " temporarily imprisoned " + msg.mentions.users.first() + " for " + hours + "h " + mins + "m.",
									timestamp: new Date(),
									footer: {
										icon_url: client.user.avatarURL,
										text: "Done by " + msg.author.username
									}
								}
							});
							let jail = client.channels.get(config.jail);
							jail.send(user.username + ", you have been imprisoned for " + hours + "h " + mins + "m.");
							setTimeout(function () { //Release them after the timeout
								let citizen = msg.guild.roles.get(config.released);
								member.setRoles([citizen]).then(() => {
									// We let the message author know we were able to allow the person
									msg.channel.send(msg.mentions.users.first() + " is now cleared of detentions.");
									let ch = client.channels.get(config.announce);
									ch.send({
										embed: {
											color: 0x31d400,
											author: {
												name: msg.author.username,
												icon_url: msg.author.avatarURL
											},
											title: "Released after timeout",
											description: msg.mentions.users.first() + " was automatically released after their term of " + hours + "h " + mins + "m expired.",
											timestamp: new Date(),
											footer: {
												icon_url: client.user.avatarURL,
												text: "Done by " + msg.author.username
											}
										}
									});
								}).catch(err => {
									// An error happened
									// This is generally due to the bot not being able to imprison the member,
									// either due to missing permissions or role hierarchy
									msg.channel.send("Hmmm, releasing " + msg.mentions.users.first() + " didn't work. (*Bot permissions error*)");
									// Log the error
									console.error(err);
								});
							}, ((hours * 3600000) + (mins * 60000)));
						}).catch(err => {
							// An error happened
							// This is generally due to the bot not being able to add the member,
							// either due to missing permissions or role hierarchy
							msg.channel.send("Hmmm, temp imprisoning " + msg.mentions.users.first() + " didnt seem to work. (*Bot permissions error*)");
							// Log the error
							console.error(err);
						});
					} else {
						// The mentioned user isn't in this guild
						msg.channel.send("Why are you trying to imprison " + msg.mentions.users.first() + " if they don't exist? (*User not found*)");
					}
					// Otherwise, if no user was mentioned
				} else {
					msg.channel.send("Oh well done " + msg.author.username + ", you forgot to tell me who to imprison. (*Missing argument*)");
				}
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't important enough. (*User unauthorised*)");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0xd4cc00,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "User unauthorised",
						description: msg.author.username + " tried to temp imprison " + msg.mentions.users.first(),
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Attempted by " + msg.author.username
						}
					}
				});
			}
		} else if (msg.content.startsWith('%release')) {
			commands = commands + 1;
			if (msg.member.roles.has(config.authRole)) {
				const user = msg.mentions.users.first();
				if (user) {
					// Now we get the member from the user
					const member = msg.guild.member(user);
					// If the member is in the guild
					if (member) {
						let citizen = msg.guild.roles.get(config.released);
						member.setRoles([citizen]).then(() => {
							// We let the message author know we were able to allow the person
							msg.channel.send(msg.mentions.users.first() + " is now cleared of detentions.");
							let ch = client.channels.get(config.announce);
							ch.send({
								embed: {
									color: 0x31d400,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									title: "Released",
									description: msg.author.username + " released " + msg.mentions.users.first(),
									timestamp: new Date(),
									footer: {
										icon_url: client.user.avatarURL,
										text: "Done by " + msg.author.username
									}
								}
							});
						}).catch(err => {
							// An error happened
							// This is generally due to the bot not being able to add the member,
							// either due to missing permissions or role hierarchy
							msg.channel.send("Hmmm, releasing " + msg.mentions.users.first() + " didn't work. (*Bot permissions error*)");
							// Log the error
							console.error(err);
						});
					} else {
						// The mentioned user isn't in this guild
						msg.channel.send("Why are you trying to release " + msg.mentions.users.first() + " if they don't exist? (*User not found*)");
					}
					// Otherwise, if no user was mentioned
				} else {
					msg.channel.send("Oh well done " + msg.author.username + ", you forgot to tell me who to release. (*Missing argument*)");
				}
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't important enough. (*User unauthorised*)");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0xd4cc00,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "User unauthorised",
						description: msg.author.username + " tried to release " + msg.mentions.users.first(),
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Attempted by " + msg.author.username
						}
					}
				});
			}
		} else if (msg.content.startsWith('%poll-b')) {
			commands = commands + 1;
			if (msg.member.roles.has(config.authRole)) {
				msg.delete();
				let polls = msg.guild.channels.get(config.polls);
				polls.send({
					embed: {
						color: 0x3E48A1,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "Poll",
						description: msg.content.substr(8),
						timestamp: new Date(),
						footer: {
							icon_url: msg.author.avatarURL,
							text: "Sent by " + msg.author.username
						}
					}
				}).then(sentEmbed => {
					sentEmbed.react("✅");
					sentEmbed.react("❎");
				});
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0x31d400,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "Created poll",
						description: msg.author.username + " created a poll.",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Done by " + msg.author.username
						}
					}
				});
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't important enough. (*User unauthorised*)");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0xd4cc00,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "User unauthorised",
						description: msg.author.username + " tried to send a poll",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Attempted by " + msg.author.username
						}
					}
				});
			}
		} else if (msg.content.startsWith('%poll-5')) {
			commands = commands + 1;
			if (msg.member.roles.has(config.authRole)) {
				msg.delete();
				let polls = msg.guild.channels.get(config.polls);
				polls.send({
					embed: {
						color: 0x3E48A1,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "Poll",
						description: msg.content.substr(8),
						timestamp: new Date(),
						footer: {
							icon_url: msg.author.avatarURL,
							text: "Sent by " + msg.author.username
						}
					}
				}).then(sentEmbed => {
					sentEmbed.react("🇦");
					sentEmbed.react("🇧");
					sentEmbed.react("🇨");
					sentEmbed.react("🇩");
					sentEmbed.react("🇪");
				});
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0x31d400,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "Created poll",
						description: msg.author.username + " created a poll.",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Done by " + msg.author.username
						}
					}
				});
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't important enough. (*User unauthorised*)");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0xd4cc00,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "User unauthorised",
						description: msg.author.username + " tried to send a poll",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Attempted by " + msg.author.username
						}
					}
				});
			}
		} else if (msg.content.startsWith('%poll-2')) {
			commands = commands + 1;
			if (msg.member.roles.has(config.authRole)) {
				msg.delete();
				let polls = msg.guild.channels.get(config.polls);
				polls.send({
					embed: {
						color: 0x3E48A1,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "Poll",
						description: msg.content.substr(8),
						timestamp: new Date(),
						footer: {
							icon_url: msg.author.avatarURL,
							text: "Sent by " + msg.author.username
						}
					}
				}).then(sentEmbed => {
					sentEmbed.react("🇦");
					sentEmbed.react("🇧");
				});
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0x31d400,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "Created poll",
						description: msg.author.username + " created a poll.",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Done by " + msg.author.username
						}
					}
				});
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't important enough. (*User unauthorised*)");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0xd4cc00,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "User unauthorised",
						description: msg.author.username + " tried to send a poll",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Attempted by " + msg.author.username
						}
					}
				});
			}
		} else if (msg.content == "ripperoni") {
			msg.channel.send("RIP in pepperonis. Press F to pay for the pizza.").then(message => {
				message.react("🇫");
			});
		} else if (msg.content == "%ls-flag") {
			commands = commands + 1;
			msg.channel.send({
				embed: {
					color: 0x3E48A1,
					author: {
						name: msg.author.username,
						icon_url: msg.author.avatarURL
					},
					title: "List of members flagged for investiagtion:",
					description: msg.guild.roles.get(config.investigate).members.map(m => m.user.tag).join('\n'),
					timestamp: new Date(),
					footer: {
						icon_url: msg.author.avatarURL,
						text: "Requested by " + msg.author.username
					}
				}
			});
		} else if (msg.content == "%ls-admins") {
			commands = commands + 1;
			msg.channel.send({
				embed: {
					color: 0x3E48A1,
					author: {
						name: msg.author.username,
						icon_url: msg.author.avatarURL
					},
					title: "List of admin members:",
					description: msg.guild.roles.get(config.authRole).members.map(m => m.user.tag).join('\n'),
					timestamp: new Date(),
					footer: {
						icon_url: msg.author.avatarURL,
						text: "Requested by " + msg.author.username
					}
				}
			});
		} else if (msg.content == "RIP") {
			msg.channel.send("RIP in peace. Press F to pay respect.").then(message => {
				message.react("🇫");
			});
		} else if (msg.content == "F") {
			msg.channel.send("Respects paid.");
		} else if (msg.content == "What's the longest word?") {
			msg.channel.send("Floccinaucinihilipilification.");
		} else if (msg.content == "Mr Moore") {
			msg.channel.send("Sam, you'll *never* be as good as me.");
		} else if (msg.content == "Who am I?") {
			msg.channel.send("You are Test Subject #" + msg.author.id + ", more commonly known as " + msg.author.username + ".");
		} else if (msg.content == "%uid") {
			msg.channel.send("*ting* Done!");
			msg.member.setNickname(msg.author.id);
		} else if (msg.content == "%undo-uid") {
			msg.channel.send("*ting* Done!");
			msg.member.setNickname(msg.author.username);
		} else if (msg.content == "noot noot") {
			msg.channel.send("https://tenor.com/view/pingu-school-gif-9416305");
		} else if (msg.content === "%update") {
			if (msg.member.roles.has(config.authRole)) {
				execute("cd ~");
				execute("./getbot.sh");
				msg.channel.send("Checking for GitHub updates...");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0x31d400,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Checking for updates...",
						description: "If any are found, they will be installed automatically.",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Automated message"
						}
					}
				});
			} else {
				msg.channel.send("User unauthorised.");
			}
		} else if (msg.content === "%pi-update") {
			if (msg.member.roles.has(config.authRole)) {
				execute("cd ~");
				execute("./update.sh");
				msg.channel.send("Checking for software updates...");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0x31d400,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Checking for software updates...",
						description: "The bot may lag or become unresponsive for up to 5mins.",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Automated message"
						}
					}
				});
			} else {
				msg.channel.send("User unauthorised.");
			}
		} else if (msg.content === "%restart") {
			if (msg.member.roles.has(config.authRole)) {
				execute("pm2 restart 0");
				msg.channel.send("Restarting... please wait.");
				let ch = client.channels.get(config.announce);
				ch.send({
					embed: {
						color: 0x31d400,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Restarting...",
						description: "Application restarting - please wait.",
						timestamp: new Date(),
						footer: {
							icon_url: msg.author.avatarURL,
							text: "Restarted by " + msg.author.username
						}
					}
				});
			} else {
				msg.channel.send("User unauthorised.");
			}
		}
	} catch (e) {
		let ch = client.channels.get(config.announce);
		ch.send({
			embed: {
				color: 0xd40000,
				author: {
					name: client.user.username,
					icon_url: client.user.avatarURL
				},
				title: "Bot Error",
				description: ("**Error details:** " + e),
				timestamp: new Date(),
				footer: {
					icon_url: client.user.avatarURL,
					text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
				}
			}
		});
	}
});
*/
client.login(config.token);