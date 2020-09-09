/*jshint esversion: 6 */

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const ytdl = require('ytdl-core');
var opus = require('opusscript');

var messages = 0;
var commands = 0;

var exec = require('child_process').exec;

function execute(command) {
	exec(command, function (error, stdout, stderr) {
		console.log(stdout);
	});
}

function hasRole(m, r) {
	if (m.roles.cache.some(role => role.id === r)) {
		return true;
	} else {
		return false;
	}
}

function randInt(b, t) {
	return Math.floor((Math.random() * t) + b);
}

function log(e) {
	let c = client.channels.cache.get(config.channels.log);
	c.send({
		embed: e
	});
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	let ch = client.channels.cache.get(config.channels.log);
	client.user.setActivity((config.activity.content + " | " + config.prefix + "help"), {
		type: config.activity.type
	});
	ch.send({
		embed: {
			color: 0x03c129,
			author: {
				name: client.user.username,
				icon_url: client.user.avatarURL
			},
			title: "Connected!",
			description: (`Version: ${config.ver} (use %changelog to see what's new)`),
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: "Automated message."
			}
		}
	});
});

client.on('message', msg => {
	try {
		messages = messages + 1; // Add one to the messages count.
		//#region
		// EASTER EGGS BEGIN HERE
		// We have to check if it's an Easter egg FIRST, because the switch/case breaks.
		if (msg.content === "ping") {
			msg.channel.send("Pong (☞ﾟヮﾟ)☞");
			msg.channel.send("*" + client.ping + "ms*");
		} else if (msg.content.toLowerCase().includes("bad bot") || msg.content.toLowerCase().includes("bad smartbot")) {
			if (randInt(0, 2) == 1) {
				msg.channel.send("You will die tonight.");
			} else {
				msg.channel.send("Bad human.");
			}
		} else if (msg.content === "F") {
			msg.channel.send("Respects paid.").then(sentMessage => {
				sentMessage.react('🇫');
			});
		} else if (msg.content.toLowerCase() === "rip") {
			msg.channel.send("Rest in peace. Press F to pay respects.").then(sentMessage => {
				sentMessage.react('🇫');
			});
		} else if (msg.content === "ripperoni") {
			msg.channel.send("Rest in pepperonis. Press 🍕 to pay respects.").then(sentMessage => {
				sentMessage.react('🍕');
			});
		} else if (msg.content.includes("UwU") || msg.content.includes("OwO")) {
			// If someone DARES to say UwU or OwO (shudders), add the Confirmed Furry role to them.
			const role = msg.guild.roles.cache.find(role => role.id === config.roles.furry);
			msg.member.roles.add(role);
			msg.channel.send("please, for the love of god, stop");
			msg.delete();
		}
		//#endregion
		//#region 
		if (msg.channel.type != 'text' || msg.author.bot || !msg.content.startsWith(config.prefix))
			return;
		let command = msg.content.split(' ')[0].slice(1);
		let args = msg.content.replace(config.prefix + command, '').trim();
		// COMMANDS BEGIN HERE! ##########################################################
		switch (command) {
			case "stat":
				// Reply with the statistics since the last restart.
				let days = Math.floor(client.uptime / 86400000);
				let hours = Math.floor(client.uptime / 3600000) % 24;
				let minutes = Math.floor(client.uptime / 60000) % 60;
				let seconds = Math.floor(client.uptime / 1000) % 60;
				commands = commands + 1;
				msg.channel.send({
					embed: {
						color: 0x03b8c1,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Statistics",
						description: "Statistics since the last restart.",
						fields: [{
								name: "Messages",
								value: messages
							},
							{
								name: "Commands",
								value: commands
							},
							{
								name: "Ping",
								value: client.ping
							},
							{
								name: "Uptime",
								value: days + "d " + hours + "h " + minutes + "m " + seconds + "s"
							}
						],
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					}
				});
				break;
			case "help":
				// Reply with the help message.
				commands = commands + 1;
				msg.channel.send("beep boop here is help");
				msg.channel.send({
					embed: {
						color: 0x03b8c1,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Help",
						description: "Here's a list of commands. Some of these require the Bot Commander role.\n\nKey: <...> = argument, (1/2/3/...) = options, @user = mention, [argument] = optional argument",
						fields: [{
								name: "General",
								value: "%stat, %help, %changelog"
							},
							{
								name: "Moderation",
								value: "%clear <n>, %kick <@user>, %ban <@user>\n%mute <@user>, %tempmute <hh:mm> <@user>, %unmute <@user>"
							},
							{
								name: "Tools",
								value: "%mood <type (w/s/l/p)> <text>, %list <(admins)>, %poll <(b/2/5)> <text>"
							},
							{
								name: "Easter Eggs",
								value: "SmartBot also has hidden Easter eggs! Try to find them all."
							}
						],
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					}
				});
				break;
			case "changelog":
				// Reply with the changelog.
				commands = commands + 1;
				msg.channel.send({
					embed: {
						color: 0x03b8c1,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Changelog for version " + config.ver,
						description: "Here's the changelog for the last update, telling you what's new, different or removed.",
						fields: [{
								name: "New",
								value: "Everything. Just check %help."
							},
							{
								name: "Changed",
								value: "--"
							},
							{
								name: "Removed",
								value: "--"
							},
							{
								name: "Complaints? Suggestions? Bugs?",
								value: "Tell MrConorAE in #smartbot-suggestions with your message."
							}
						],
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					}
				});
				break;
			case "clear":
				// Clear messages in a channel.
				num = args[0]; // Get the amount of messages to clear.
				if (hasRole(msg.member, config.roles.commander)) {
					// They are authorised.
					msg.channel.bulkDelete(Number(num) + 1);
					msg.channel.send("Foof! " + num + " messages are now no more.");
					log({
						color: 0x03c129,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Messages Cleared",
						description: msg.author.username + " cleared " + num + " messages in the " + msg.channel.name + " channel.",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				} else {
					// They are not authorised.
					msg.channel.send("No.");
					log({
						color: 0xe0e812,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Permission Denied",
						description: msg.author.username + " attempted to clear " + num + " messages in the " + msg.channel.name + " channel.",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				}
				break;
			case "ban":
				// Ban a user.
				user = msg.mentions.users.first();
				if (hasRole(msg.member, config.roles.commander)) {
					// They are authorised.
					msg.guild.members.ban(user, {
						reason: `Banned by ${msg.author.username}, using SmartBot.`
					});
					msg.channel.send("Hippity hoppity, " + user.username + " is banned from this property.");
					log({
						color: 0x03c129,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "User Banned",
						description: msg.author.username + " banned " + user.username + ".",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				} else {
					// They are not authorised.
					msg.channel.send("No.");
					log({
						color: 0xe0e812,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Permission Denied",
						description: msg.author.username + " attempted to ban " + user.username + ".",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				}
				break;
			case "kick":
				// Kick a user.
				const member = msg.mentions.members.first();
				if (hasRole(msg.member, config.roles.commander)) {
					// They are authorised.
					member.kick(`Kicked by ${msg.author.username}, using SmartBot.`);
					msg.channel.send("Yeet! " + member.user.username + " is kicked.");
					log({
						color: 0x03c129,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "User Kicked",
						description: msg.author.username + " kicked " + member.user.username + ".",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				} else {
					// They are not authorised.
					msg.channel.send("No.");
					log({
						color: 0xe0e812,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Permission Denied",
						description: msg.author.username + " attempted to kick " + member.user.username + ".",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				}
				break;
			case "voice":
				if (msg.channel.type !== 'text') return;

				const voiceChannel = msg.member.voice.channel;

				if (!voiceChannel) {
					return msg.channel.send('Join a voice channel first, dum dum.');
				}

				voiceChannel.join().then(connection => {
					stream = undefined;
					/*if (randInt(0, 1) == 0) {
						stream = ytdl(config.audio.inhale, {
							filter: 'audioonly'
						});
					} else {
						stream = ytdl(config.audio.throat, {
							filter: 'audioonly'
						});
					}
					dispatcher = connection.play(stream);
					dispatcher.on('end', () => function () {*/
					if (randInt(0, 1) == 0) {
						stream = ytdl(config.audio.reee, {
							filter: 'audioonly'
						});
					} else {
						stream = ytdl(config.audio.rickroll, {
							filter: 'audioonly'
						});
					}
					dispatcher = connection.play(stream);
					dispatcher.on('end', () => connection.disconnect());
					//});
				});
				break;
				// USEFUL COMMANDS
			case "restart":
				if (msg.author.id === "491026695244087316") {
					msg.channel.send("Wheeee! Let's get reincarnated by PM2!");
					log({
						color: 0x03c129,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Restarting...",
						description: msg.author.username + " requested a restart.",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
					process.exit();
				} else {
					// They are not authorised.
					msg.channel.send("No.");
					log({
						color: 0xe0e812,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Permission Denied",
						description: msg.author.username + " attempted to request a restart.",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				}
				break;
			case "reconnect":
				if (msg.author.id === "491026695244087316") {
					msg.channel.send("'Turn it off and on again', they said...");
					log({
						color: 0x03c129,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Restarting...",
						description: msg.author.username + " requested a reconnection.",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
					client.destroy().then(() => {
						client.login('token');
					});
				} else {
					// They are not authorised.
					msg.channel.send("No.");
					log({
						color: 0xe0e812,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Permission Denied",
						description: msg.author.username + " attempted to request a reconnection.",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				}
				break;
			case "shutdown":
				if (msg.author.id === "491026695244087316") {
					msg.channel.send("Right, off to kill myself.");
					log({
						color: 0x03c129,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Shutting down...",
						description: msg.author.username + " requested a shutdown.",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
					client.destroy().then(() => {
						client.login('token');
					});
				} else {
					// They are not authorised.
					msg.channel.send("No.");
					log({
						color: 0xe0e812,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Permission Denied",
						description: msg.author.username + " attempted to request a shutdown.",
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				}
				break;
		}
		//#endregion
	} catch (e) {
		msg.channel.send("You broke something. Well done. Please contact MrConorAE.").then(sentMessage => {
			sentMessage.react('👏');
		});
		log({
			color: 0xd40000,
			author: {
				name: client.user.username,
				icon_url: client.user.avatarURL
			},
			title: "Error!",
			description: ("**Error details:** " + e),
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
			}
		});
	}
});

process.on('unhandledRejection', error => function () {
	ch = client.channels.cache.get(config.channels.general);
	ch.send("Welp, Unhandled Promise Rejection. Please contact MrConorAE.");
	console.error('Uncaught Promise Rejection', error);
	log({
		color: 0xd40000,
		author: {
			name: client.user.username,
			icon_url: client.user.avatarURL
		},
		title: "Unhandled Promise Rejection",
		description: ("**Error details:** " + error),
		timestamp: new Date(),
		footer: {
			icon_url: client.user.avatarURL,
			text: "Automated message"
		}
	});
});

client.login(config.token);