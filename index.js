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

function hasRole(m, r) {
	if (m.roles.cache.some(role => role.id === r)) {
		return true;
	} else {
		return false;
	}
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
	client.user.setActivity(config.activity.content, {
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
		// COMMANDS BEGIN HERE
		if (msg.content === "%stat") {
			// Reply with the statistics since the last restart.
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
							name: "Uptime",
							value: client.uptime
						}
					],
					timestamp: new Date(),
					footer: {
						icon_url: client.user.avatarURL,
						text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
					}
				}
			});
		} else if (msg.content === "%help") {
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
		} else if (msg.content === "%changelog") {
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
		} else if (msg.content.startsWith("%clear")) {
			// Clear messages in a channel.
			num = msg.content.slice(7); // Get the amount of messages to clear.
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
		} else if (msg.content.startsWith("%ban")) {
			// Ban a user.
			if (hasRole(msg.member, config.roles.commander)) {
				// They are authorised.
				user = msg.mentions.users.first();
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
		} else if (msg.content.startsWith("%kick")) {
			// Kick a user.
			if (hasRole(msg.member, config.roles.commander)) {
				// They are authorised.
				const member = msg.mentions.members.first();
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
		}
		// EASTER EGGS BEGIN HERE
		else if (msg.content === "ping") {
			msg.channel.send("Pong (☞ﾟヮﾟ)☞");
		} else if (msg.content.toLowerCase() === "bad bot" || msg.content.toLowerCase() === "bad smartbot") {
			msg.channel.send("Pong (☞ﾟヮﾟ)☞");
		} else if (msg.content === "F") {
			msg.channel.send("Respects paid.");
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
			const member = msg.member;
			member.roles.add(role);
		}
	} catch (e) {
		let ch = client.channels.cache.get(config.channels.log);
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