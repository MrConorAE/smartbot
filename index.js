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
});

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
			num = msg.content.slice(7);
			if (hasRole(msg.author, config.roles.commander)) {
				msg.channel.bulkDelete(num + 1);
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
				})
			}
		}
		// EASTER EGGS BEGIN HERE
		else if (msg.content === "%ping") {
			msg.channel.send("Pong (☞ﾟヮﾟ)☞");
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