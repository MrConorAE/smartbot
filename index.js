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
});

client.on('message', msg => {
	if (msg.content === "ping") {
		msg.channel.send("pong (☞ﾟヮﾟ)☞");
	}
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	let ch = client.channels.fetch(config.channels.log);
	ch.setTopic("Last restart: " + client.readyAt + " - Version: v" + config.ver);
	client.user.setActivity(config.activity.content, {
		type: config.activity.type
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
							value: "Programmed in node.js and discord.js. Hosted on a Raspberry Pi 2B+."
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
							value: "Added LOADS of commands."
						},
						{
							name: "Known issues",
							value: "*None*\n*(found one? DM @MrConorAE.)*"
						},
						{
							name: "To report any new bugs",
							value: "Contact **@MrConorAE**!"
						},
					],
					timestamp: new Date(),
					footer: {
						icon_url: msg.author.avatarURL,
						text: "Requested by " + msg.author.username
					}
				}
			});
		} else if (msg.content === '%help' || msg.content.toLowerCase() === 'smartbot' || msg.content.toLowerCase() == "smart bot") {
			commands = commands + 1;
			msg.channel.send("beep boop here is help");
			msg.channel.send({
				embed: {
					color: 3447003,
					author: {
						name: "Help",
						icon_url: client.user.avatarURL
					},
					fields: [{
							name: "Moderation",
							value: "%kick <@user>, %ban <@user>"
						},
						{
							name: "User Management",
							value: "%mute <@user>, %tempmute <hhmm> <@user>, %unmute <@user>"
						},
						{
							name: "Channel Management",
							value: "%clear <no. of messages>"
						},
						{
							name: "Bot Information",
							value: "%stat, %changelog"
						},
						{
							name: "Polls",
							value: "%poll-b (yes/no poll), %poll-2 (a/b poll), %poll-5 (a/b/c/d/e poll)"
						},
						{
							name: "If the bot does not respond:",
							value: "Ping **@MrConorAE** and I'll try to fix it as soon as possible."
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
			} else if (msg.member.roles.has(config.roles.commander)) {
				msg.channel.bulkDelete(msg.content.substr(7));
				msg.channel.send("Foof! " + msg.content.substr(7) + " messages are now no more.");
				let ch = client.channels.fetch(config.channels.log);
				ch.send({
					embed: {
						color: 0x31d400,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "Cleared messages",
						description: msg.author.username + " cleared messages in " + msg.channel.name + ".",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Done by " + msg.author.username
						}
					}
				});
			} else {
				msg.channel.send("No. \n*" + msg.author.username + " doesn't have permission to clear messages.*");
				let ch = client.channels.fetch(config.channels.log);
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
			} else if (msg.member.roles.has(config.roles.commander)) {
				var action = msg.content.substr(6, 1).toUpperCase();
				var actionParsed;
				if (action === "W") {
					actionParsed = "WATCHING";
					msg.channel.send("Mood changed to " + mood + ".");
					client.user.setActivity(mood, {
						type: actionParsed
					});
					let ch = client.channels.fetch(config.channels.log);
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
				} else if (action === "P") {
					actionParsed = "PLAYING";
					msg.channel.send("Mood changed to " + mood + ".");
					client.user.setActivity(mood, {
						type: actionParsed
					});
					let ch = client.channels.fetch(config.channels.log);
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
				} else if (action === "S") {
					actionParsed = "STREAMING";
					msg.channel.send("Mood changed to " + mood + ".");
					client.user.setActivity(mood, {
						type: actionParsed
					});
					let ch = client.channels.fetch(config.channels.log);
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
				} else if (action === "L") {
					actionParsed = "LISTENING";
					msg.channel.send("Mood changed to " + mood + ".");
					client.user.setActivity(mood, {
						type: actionParsed
					});
					let ch = client.channels.fetch(config.channels.log);
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
					msg.channel.send("That isn't right! Please provide a valid action type.");
				}
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't special enough.\n*User unauthorised*");
				let ch = client.channels.fetch(config.channels.log);
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
		} else if (msg.content.toLowerCase() === "bad smartbot." || msg.content.toLowerCase() === "bad bot.") {
			msg.channel.send("Bad human.");
		} else if (msg.content.startsWith('%kick')) {
			commands = commands + 1;
			if (msg.member.roles.has(config.roles.commander)) {
				const user = msg.mentions.users.first();
				if (user) {
					// Now we get the member from the user
					const member = msg.guild.member(user);
					// If the member is in the guild
					if (member) {
						member.kick('Kicked by Smartbot, becuse I was told to kick them.').then(() => {
							// We let the message author know we were able to kick the person
							msg.channel.send("Yeetus deletus, that " + msg.mentions.users.first() + " is gone.");
							let ch = client.channels.fetch(config.channels.log);
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
							msg.channel.send("I couldn't kick " + msg.mentions.users.first() + ".\n* This is probably a bot permissions error*");
							// Log the error
							console.error(err);
						});
					} else {
						// The mentioned user isn't in this guild
						msg.channel.send("Sorry, who is " + msg.mentions.users.first() + "?\n*User not found*");
					}
					// Otherwise, if no user was mentioned
				} else {
					msg.channel.send("Oh well done " + msg.author.username + ", you forgot to tell me who to kick.\*Missing argument*");
				}
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't special enough.\n*User unauthorised*");
				let ch = client.channels.fetch(config.channels.log);
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
			if (msg.member.roles.has(config.roles.commander)) {
				const user = msg.mentions.users.first();
				if (user) {
					// Now we get the member from the user
					const member = msg.guild.member(user);
					// If the member is in the guild
					if (member) {
						member.ban('Banned by Smartbot, becuse I was told to ban them.').then(() => {
							// We let the message author know we were able to kick the person
							msg.channel.send("Hippity hoppity, " + msg.mentions.users.first() + " is off this property.");
							let ch = client.channels.fetch(config.channels.log);
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
							msg.channel.send("Hrm, banning " + msg.mentions.users.first() + " didn't work.\n*Probably a bot permissions error*");
							// Log the error
							console.error(err);
						});
					} else {
						// The mentioned user isn't in this guild
						msg.channel.send("Sorry, who is " + msg.mentions.users.first() + "?\n*User not found*");
					}
					// Otherwise, if no user was mentioned
				} else {
					msg.channel.send("Oh big brain, " + msg.author.username + ", you forgot to tell me who to ban.\n*Missing argument*");
				}
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't special enough.\n*User unauthorised*");
				let ch = client.channels.fetch(config.channels.log);
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
			if (msg.member.roles.has(config.roles.commander)) {
				const user = msg.mentions.users.first();
				if (user) {
					// Now we get the member from the user
					const member = msg.guild.member(user);
					// If the member is in the guild
					if (member) {
						let muted = msg.guild.roles.get(config.roles.muted);
						member.setRoles([muted]).then(() => {
							// We let the message author know we were able to allow the person
							msg.channel.send("Detention, " + msg.mentions.users.first() + " - see me after this.");
							let ch = client.channels.fetch(config.channels.log);
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
							let jail = client.channels.fetch(config.channels.default);
							jail.send(user.username + ", you have been imprisoned!");
						}).catch(err => {
							// An error happened
							// This is generally due to the bot not being able to add the member,
							// either due to missing permissions or role hierarchy
							msg.channel.send("Hmmm, muting " + msg.mentions.users.first() + " didnt seem to work.\n*Probably a bot permissions error.*");
							// Log the error
							console.error(err);
						});
					} else {
						// The mentioned user isn't in this guild
						msg.channel.send("Sorry, who is " + msg.mentions.users.first() + "?\n*User not found*");
					}
					// Otherwise, if no user was mentioned
				} else {
					msg.channel.send("Well, that was big brain, " + msg.author.username + " - you forgot to tell me who to mute.\n*Missing argument*");
				}
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't special enough.\n*User unauthorised*");
				let ch = client.channels.fetch(config.channels.log);
				ch.send({
					embed: {
						color: 0xd4cc00,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "User unauthorised",
						description: msg.author.username + " tried to mute " + msg.mentions.users.first(),
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Attempted by " + msg.author.username
						}
					}
				});
			}
		} else if (msg.content.startsWith('%tempmute')) {
			commands = commands + 1;
			if (msg.member.roles.has(config.roles.commander)) {
				const user = msg.mentions.users.first();
				const hours = msg.content.substr(11, 2);
				const mins = msg.content.substr(13, 2);
				if (user) {
					// Now we get the member from the user
					const member = msg.guild.member(user);
					// If the member is in the guild
					if (member) {
						let muted = msg.guild.roles.get(config.roles.muted);
						member.setRoles([muted]).then(() => {
							// We let the message author know we were able to allow the person
							msg.channel.send("Thou shalt speaketh no more, " + msg.mentions.users.first() + "!");
							let ch = client.channels.fetch(config.channels.log);
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
							let jail = client.channels.fetch(config.channels.default);
							jail.send(user.username + ", you have been muted for " + hours + "h " + mins + "m.");
							setTimeout(function () { //Release them after the timeout
								let citizen = msg.guild.roles.get(config.released);
								member.setRoles([citizen]).then(() => {
									// We let the message author know we were able to allow the person
									msg.channel.send(msg.mentions.users.first() + " is now unmuted.");
									let ch = client.channels.fetch(config.channels.log);
									ch.send({
										embed: {
											color: 0x31d400,
											author: {
												name: msg.author.username,
												icon_url: msg.author.avatarURL
											},
											title: "Released after timeout",
											description: msg.mentions.users.first() + " was automatically unmuted after their term of " + hours + "h " + mins + "m expired.",
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
									msg.channel.send("Hmmm, unmuting " + msg.mentions.users.first() + " didn't work.\n*This is probably a bot permissions error.*");
									// Log the error
									console.error(err);
								});
							}, ((hours * 3600000) + (mins * 60000)));
						}).catch(err => {
							// An error happened
							// This is generally due to the bot not being able to add the member,
							// either due to missing permissions or role hierarchy
							msg.channel.send("Hmmm, muting " + msg.mentions.users.first() + " didn't seem to work.\n*This is probably a bot permissions error.*");
							// Log the error
							console.error(err);
						});
					} else {
						// The mentioned user isn't in this guild
						msg.channel.send("Sorry, who is " + msg.mentions.users.first() + "?\n*User not found.*");
					}
					// Otherwise, if no user was mentioned
				} else {
					msg.channel.send("Big brain. " + msg.author.username + ", you forgot to tell me who to mute.\n*Missing argument.*");
				}
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't special enough.\n*User unauthorised.*");
				let ch = client.channels.fetch(config.channels.log);
				ch.send({
					embed: {
						color: 0xd4cc00,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "User unauthorised",
						description: msg.author.username + " tried to temporarily mute " + msg.mentions.users.first(),
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Attempted by " + msg.author.username
						}
					}
				});
			}
		} else if (msg.content.startsWith('%unmute')) {
			commands = commands + 1;
			if (msg.member.roles.has(config.roles.commander)) {
				const user = msg.mentions.users.first();
				if (user) {
					// Now we get the member from the user
					const member = msg.guild.member(user);
					// If the member is in the guild
					if (member) {
						member.setRoles([]).then(() => {
							// We let the message author know we were able to allow the person
							msg.channel.send(msg.mentions.users.first() + " is now unmuted.");
							let ch = client.channels.fetch(config.channels.log);
							ch.send({
								embed: {
									color: 0x31d400,
									author: {
										name: msg.author.username,
										icon_url: msg.author.avatarURL
									},
									title: "Unmuted",
									description: msg.author.username + " unmuted " + msg.mentions.users.first(),
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
							msg.channel.send("Hmmm, unmuting " + msg.mentions.users.first() + " didn't work.\n* This is probably a bot permissions error.*)");
							// Log the error
							console.error(err);
						});
					} else {
						// The mentioned user isn't in this guild
						msg.channel.send("Sorry, who is " + msg.mentions.users.first() + "?\n*User not found*");
					}
					// Otherwise, if no user was mentioned
				} else {
					msg.channel.send("Big brain. " + msg.author.username + ", you forgot to tell me who to unmute.\n*Missing argument*");
				}
			} else {
				msg.channel.send("I would do it, but " + msg.author.username + " isn't special enough.\n*You don't have permission.*");
				let ch = client.channels.fetch(config.channels.log);
				ch.send({
					embed: {
						color: 0xd4cc00,
						author: {
							name: msg.author.username,
							icon_url: msg.author.avatarURL
						},
						title: "User unauthorised",
						description: msg.author.username + " tried to unmute " + msg.mentions.users.first(),
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
			if (msg.member.roles.has(config.roles.commander)) {
				msg.delete();
				let polls = msg.guild.channels.get(config.channels.polls);
				polls.send({
					embed: {
						color: 0x04d1ca,
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
				let ch = client.channels.fetch(config.channels.log);
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
				let ch = client.channels.fetch(config.channels.log);
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
			if (msg.member.roles.has(config.roles.commander)) {
				msg.delete();
				let polls = msg.guild.channels.get(config.channels.polls);
				polls.send({
					embed: {
						color: 0x04d1ca,
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
				let ch = client.channels.fetch(config.channels.log);
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
				let ch = client.channels.fetch(config.channels.log);
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
			if (msg.member.roles.has(config.roles.commander)) {
				msg.delete();
				let polls = msg.guild.channels.get(config.channels.polls);
				polls.send({
					embed: {
						color: 0x04d1ca,
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
				let ch = client.channels.fetch(config.channels.log);
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
				let ch = client.channels.fetch(config.channels.log);
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
		} else if (msg.content == "%ls-admins") {
			commands = commands + 1;
			msg.channel.send({
				embed: {
					color: 0x04d1ca,
					author: {
						name: msg.author.username,
						icon_url: msg.author.avatarURL
					},
					title: "List of people with bot permissions:",
					description: msg.guild.roles.get(config.roles.commander).members.map(m => m.user.tag).join('\n'),
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
		} else if (msg.content == "noot noot") {
			msg.channel.send("https://tenor.com/view/pingu-school-gif-9416305");
		}
	} catch (e) {
		let ch = client.channels.fetch(config.channels.log);
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

client.login(config.token);