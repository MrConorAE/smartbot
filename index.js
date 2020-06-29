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
	let ch = client.channels.cache.get(config.channels.log);
	//ch.setTopic("Last restart: " + client.readyAt + " - Version: v" + config.ver);
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
		// Commands begin here. //
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