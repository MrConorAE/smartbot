/*jshint esversion: 6 */

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const secret = require("./token.json");
const ytdl = require('ytdl-core');
const fs = require('fs');
var opus = require('opusscript');
const {
	PassThrough
} = require('stream');

var messages = 0;
var commands = 0;

var exec = require('child_process').exec;

var queue = [];
var voiceChannel;
var connection;

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
	console.log(`Connected as ${client.user.tag}. Version ${config.ver}, token ${secret.token}`);
	let ch = client.channels.cache.get(config.channels.log);
	client.user.setActivity((config.activity.content + " | " + config.prefix + "help"), {
		type: config.activity.type
	});
	ch.send({
		embed: {
			color: config.colors.success,
			author: {
				name: "Online",
				icon_url: "https://i.ibb.co/mNyyfLc/connected.png"
			},
			title: "Connected!",
			description: (`Version: ${config.ver}.`),
			timestamp: new Date(),
			footer: {
				icon_url: "",
				text: "Automated message."
			}
		}
	});
});

client.on('message', msg => {
	try {
		messages = messages + 1; // Add one to the messages count.
		//#region
		// SPECIFIC CHANNEL EXCEPTIONS BEGIN HERE
		// This section is for things like the video-ideas channel.
		if (msg.channel.id == config.channels.videos) {
			if (msg.content.startsWith("%")) {
				if (!hasRole(msg.member, config.roles.commander)) {
					// This is the super-secret exemption (shh!)
					// Anyone with Bot Admin roles can BYPASS the auto-conversion system by prefixing their message with a '%'.
					msg.reply("please only send suggestions in this channel!").then(sent => {
						setTimeout(function () {
							sent.delete();
						}, 5000);
					});
					msg.delete();
					return;
				} else {
					return;
				}
			}
			if (msg.author.bot) {
				return;
			}
			msg.delete();
			suggestion = msg.content;
			suggestionChannel = client.channels.cache.get(config.channels.videos);
			// pre posting checks
			if (suggestion == "") {
				return;
			} else if (suggestion.toLowerCase().includes("physics video")) {
				msg.delete();
				msg.channel.send("> 'Physics video aint happening pls stop filling #video-ideas'\n> *~ SmartGeneral*\n\nYour suggestion was automatically deleted.");
				return;
			}
			suggestionSent = undefined;
			suggestionChannel.send({
				embed: {
					color: config.colors.info,
					author: {
						name: "Video Suggestion",
						icon_url: "https://i.ibb.co/VBcP7Z0/video.png"
					},
					title: suggestion,
					timestamp: new Date(),
					footer: {
						icon_url: "",
						text: "by " + msg.author.username
					}
				}
			}).then(sentEmbed => {
				sentEmbed.react("👍");
				sentEmbed.react("👎");
				sentEmbed.react("⛔");
				// Wait for "no_entry" reactions for deletion
				let filter = (reaction, user) => {
					return ['⛔'].includes(reaction.emoji.name);
				};
				sentEmbed.awaitReactions(filter, {
						max: 3,
						time: 120000,
						errors: ['time']
					})
					.then(collected => {
						const reaction = collected.first();

						if (reaction.emoji.name === '⛔') {
							sentEmbed.delete();
							log({
								color: config.colors.success,
								author: {
									name: "Suggestion Deleted",
									icon_url: "https://i.ibb.co/ThWryyQ/generic-success.png"
								},
								title: "Video suggestion removed!",
								description: msg.author.username + "'s suggestion ('" + suggestion + "') was voted out or deleted.",
								timestamp: new Date(),
								footer: {
									icon_url: "",
									text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
								}
							});
						}
					})
					.catch(collected => {
						sentEmbed.reactions.cache.get('⛔').remove().catch(error => log({
							color: config.colors.error,
							author: {
								name: "Error",
								icon_url: "https://i.ibb.co/GMfJcN5/error.png"
							},
							title: "Exception Thrown",
							fields: [{
									name: "Could not remove reaction:",
									value: e
								},
								{
									name: "Please report this error in the support server:",
									value: "https://discord.gg/DuAXWXv"
								}
							],
							timestamp: new Date(),
							footer: {
								icon_url: "",
								text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
							}
						}));
					});
			});
			return;
		}
		//#endregion
		//#region
		// EASTER EGGS BEGIN HERE
		// We have to check if it's an Easter egg FIRST, because the switch/case breaks.
		if (msg.content.toLowerCase() === "ping") {
			msg.channel.send("Pong (☞ﾟヮﾟ)☞");
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
						color: config.colors.info,
						author: {
							name: "Statistics",
							icon_url: "https://i.ibb.co/7GVn47j/statistics.png"
						},
						title: "Server Statistics",
						description: "Statistics since the last restart.",
						fields: [{
								name: "Messages Sent",
								value: messages
							},
							{
								name: "Commands Run",
								value: commands
							},
							{
								name: "Bot Uptime",
								value: days + "d " + hours + "h " + minutes + "m " + seconds + "s"
							}
						],
						timestamp: new Date(),
						footer: {
							icon_url: "",
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
						color: config.colors.info,
						author: {
							name: "Help",
							icon_url: "https://i.ibb.co/0s5M7LX/help.png"
						},
						title: "Command List",
						description: "Here's a list of commands. Some of these require the Bot Commander role.\n\nKey: <...> = argument, (1/2/3/...) = options, @user = mention, [argument] = optional argument\nItems in ~~strikethrough~~ are not implemented yet.",
						fields: [{
								name: "General",
								value: "%stat, %help, %changelog"
							},
							{
								name: "Moderation",
								value: "%clear <n>, %kick <@user>, %ban <@user>\n%~~mute <@user>~~, ~~%tempmute <hh:mm> <@user>~~, ~~%unmute <@user>~~"
							},
							{
								name: "Tools",
								value: "~~%mood <type (w/s/l/p)> <text>~~, ~~%list <(admins)>~~, ~~%poll <(b/2/5)> <text>~~, %voice <(name/YouTube link/leave/pause/resume)>"
							},
							{
								name: "Easter Eggs",
								value: "SmartBot also has a bunch of hidden Easter eggs! Try to find them all."
							},
							{
								name: "Support Server",
								value: "Found a bug? Want to learn about bot development?\nJoin the Bot Emporium server!\nhttps://discord.gg/DuAXWXv"
							}
						],
						timestamp: new Date(),
						footer: {
							icon_url: "",
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
						color: config.colors.info,
						author: {
							name: "Changelog",
							icon_url: "https://i.ibb.co/dK7CzfM/changelog.png"
						},
						title: "Changelog for v" + config.ver,
						description: "Here's the changelog for the last update, telling you what's new, different or removed.",
						fields: [{
								name: "New",
								value: "- You can now play any YouTube video by sending the link!\n- Make the bot leave a voice channel immediately by typing `%voice leave`.\n- You can also pause or play the current audio by typing `%voice pause` and `%voice resume`."
							},
							{
								name: "Changed",
								value: "- Added more audio files to the `%voice` command."
							},
							{
								name: "Removed",
								value: "Nothing in this release."
							},
							{
								name: "Complaints? Suggestions? Bugs?",
								value: "Tell MrConorAE in #smartbot-suggestions with your message."
							}
						],
						timestamp: new Date(),
						footer: {
							icon_url: "",
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					}
				});
				break;
			case "repost":
				message = msg.content.replace(config.prefix + command, '').trim();
				if (message == "") {
					return;
				}
				if (hasRole(msg.member, config.roles.commander)) {
					// They are authorised.
					msg.delete();
					msg.channel.send(message);
					log({
						color: config.colors.success,
						author: {
							name: "Repost Successful",
							icon_url: "https://i.ibb.co/ThWryyQ/generic-success.png"
						},
						title: "Message Reposted!",
						description: msg.author.username + " reposted the message '" + message + "' in #" + msg.channel.name + ".",
						timestamp: new Date(),
						footer: {
							icon_url: "",
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				} else {
					// They are not authorised.
					msg.channel.send("No.");
					log({
						color: config.colors.warning,
						author: {
							name: "Permission Denied",
							icon_url: "https://i.ibb.co/3zq37sV/permissions.png"
						},
						title: "Repost denied.",
						description: msg.author.username + " attempted to repost' " + message + "' in #" + msg.channel.name + ".",
						timestamp: new Date(),
						footer: {
							icon_url: "",
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				}
				break;
			case "suggest":
				msg.channel.send(":warning: This command is deprecated. Please just send your suggestion directly to the suggestions channel.");
				break;
			case "clear":
				// Clear messages in a channel.
				num = msg.content.replace(config.prefix + command, '').trim(); // Get the amount of messages to clear.
				if (num == "" || parseInt(num) < 1 || isNaN(parseInt(num))) {
					msg.channel.send("You know, it'd be nice if you *actually told me how many to clear*...");
					return;
				}
				if (hasRole(msg.member, config.roles.commander)) {
					// They are authorised.
					msg.channel.bulkDelete(Number(num) + 1);
					msg.channel.send("Foof! " + num + " messages are now no more.");
					log({
						color: config.colors.success,
						author: {
							name: "Bulk Delete Successful",
							icon_url: "https://i.ibb.co/DrPgS1T/bulk-clear.png"
						},
						title: "Messages Cleared!",
						description: msg.author.username + " cleared " + num + " messages in the " + msg.channel.name + " channel.",
						timestamp: new Date(),
						footer: {
							icon_url: "",
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				} else {
					// They are not authorised.
					msg.channel.send("No.");
					log({
						color: config.colors.warning,
						author: {
							name: "Permission Denied",
							icon_url: "https://i.ibb.co/3zq37sV/permissions.png"
						},
						title: "Bulk Delete denied.",
						description: msg.author.username + " attempted to clear " + num + " messages in the " + msg.channel.name + " channel.",
						timestamp: new Date(),
						footer: {
							icon_url: "",
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				}
				break;
			case "ban":
				// Ban a user.
				if (msg.content.replace(config.prefix + command, '').trim() == "" || msg.mentions.users.size == 0) {
					msg.channel.send("You know, it'd be nice if you *actually told me who to ban*...");
					return;
				}
				user = msg.mentions.users.first();
				if (hasRole(msg.member, config.roles.commander)) {
					// They are authorised.
					msg.guild.members.ban(user, {
						reason: `Banned by ${msg.author.username}, using SmartBot.`
					});
					msg.channel.send("Hippity hoppity, " + user.username + " is banned from this property.");
					log({
						color: config.colors.success,
						author: {
							name: "Ban Successful",
							icon_url: "https://i.ibb.co/x3BrRKs/ban.png"
						},
						title: "User banned!",
						description: msg.author.username + " banned " + user.username + ".",
						timestamp: new Date(),
						footer: {
							icon_url: "",
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				} else {
					// They are not authorised.
					msg.channel.send("No.");
					log({
						color: config.colors.warning,
						author: {
							name: "Permission Denied",
							icon_url: "https://i.ibb.co/3zq37sV/permissions.png"
						},
						title: "Ban denied.",
						description: msg.author.username + " attempted to ban " + user.username + ".",
						timestamp: new Date(),
						footer: {
							icon_url: "",
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				}
				break;
			case "kick":
				// Kick a user.
				if (msg.content.replace(config.prefix + command, '').trim() == "" || msg.mentions.users.size == 0) {
					msg.channel.send("You know, it'd be nice if you *actually told me who to kick*...");
					return;
				}
				member = msg.mentions.members.first();
				if (hasRole(msg.member, config.roles.commander)) {
					// They are authorised.
					member.kick(`Kicked by ${msg.author.username}, using SmartBot.`);
					msg.channel.send("Yeet! " + member.user.username + " is kicked.");
					log({
						color: config.colors.success,
						author: {
							name: "Kick Successful",
							icon_url: "https://i.ibb.co/CKHyTwT/kick.png"
						},
						title: "User kicked!",
						description: msg.author.username + " kicked " + member.user.username + ".",
						timestamp: new Date(),
						footer: {
							icon_url: "",
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				} else {
					// They are not authorised.
					msg.channel.send("No.");
					log({
						color: config.colors.warning,
						author: {
							name: "Permission Denied",
							icon_url: "https://i.ibb.co/3zq37sV/permissions.png"
						},
						title: "Kick denied.",
						description: msg.author.username + " attempted to kick " + member.user.username + ".",
						timestamp: new Date(),
						footer: {
							icon_url: "",
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				}
				break;
			case "v": //alias for "voice"
			case "voice":
				if (msg.channel.type !== 'text') return;

				var userVoice = msg.member.voice.channel;

				if (!userVoice) {
					return msg.channel.send("you need to be in a voice channel to control voice, dum dum");
				} else if (userVoice == voiceChannel) {
					return msg.channel.send("i'm already in a different voice channel, sorry\neither move into the other channel, or ask for the other user(s) to disconnect me (`%v leave`).");
				}
				if (connection) {
					// Already connected.
				} else {
					// Not connected yet, so join.
					connection = voiceChannel.join();
				}
				var stream;
				arg = msg.content.replace(config.prefix + command, '').trim();
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
				var selected;
				var dispatcher;
				var audio;
				if (arg == "ree") {
					selected = config.audio.reee;
				} else if (arg == "rickroll") {
					selected = config.audio.rickroll;
				} else if (arg == "thomas") {
					selected = config.audio.thomas;
				} else if (arg == "running") {
					selected = config.audio.running;
				} else if (arg == "gas") {
					selected = config.audio.gas;
				} else if (arg == "rasputin") {
					selected = config.audio.rasputin;
				} else if (arg == "gear") {
					selected = config.audio.gear;
				} else if (arg == "sounds") {
					selected = config.audio.sounds;
				} else if (arg == "call") {
					selected = config.audio.call;
				} else if (arg == "callremix") {
					selected = config.audio.callremix;
				} else if (arg == "trailer") {
					selected = config.audio.trailer;
				} else if (arg == "uuua") {
					selected = config.audio.uuua;
				} else if (arg == "countdown") {
					selected = config.audio.countdown;
				} else if (arg == "ymca") {
					selected = config.audio.ymca;
				} else if (arg == "distract") {
					selected = config.audio.distract;
				} else if (arg == "mii") {
					selected = config.audio.mii;
				} else if (arg == "spin") {
					selected = config.audio.spin;
				} else if (arg.startsWith("https://www.youtube.com/watch?v")) { //If it's a YT video link, play it
					if (arg == "https://www.youtube.com/watch?v=zQawXvCd-fs") {
						msg.channel.send("no, not again");
						return;
					}
					selected = arg;
					arg = "the video";
				} else if (arg == "leave") {
					voiceChannel.leave();
					msg.channel.send(":( bye");
					return;
				}
				// Special cases: control commands
				/*
				else if (arg == "pause") {
					if (!dispatcher.paused) {
						msg.channel.send("righty ho, pausing");
						dispatcher.pause();
					} else {
						msg.channel.send("there's nothing playing to pause, dum dum");
					}
					return;
				} else if (arg == "resume") {
					if (dispatcher.paused) {
						msg.channel.send("righty ho, resuming");
						dispatcher.pause();
					} else {
						msg.channel.send("there's nothing paused to resume, dum dum");
					}
					return;
				} */
				else if (arg.startsWith("record")) {
					if (hasRole(msg.member, config.roles.commander)) {
						// Create a ReadableStream of s16le PCM audio
						audio = connection.receiver.createStream(msg.mentions.members.first(), {
							mode: 'pcm',
							end: 'manual'
						});
						audio.pipe(fs.createWriteStream('user_audio'));
						msg.channel.send("ok, started");
					} else {
						msg.channel.send("No.");
					}
				} else if (arg == "stoprecord") {
					if (hasRole(msg.member, config.roles.commander)) {
						// Destroy the ReadableStream
						audio.destroy();
						msg.channel.send("ok, stopped");
					} else {
						msg.channel.send("No.");
					}
				} else if (arg == "playrecord") {
					if (hasRole(msg.member, config.roles.commander)) {
						dispatcher = connection.play(audio, {
							type: 'opus'
						});
						msg.channel.send("ok, playing");
					} else {
						msg.channel.send("No.");
					}
				} else {
					msg.channel.send("umm, what?\nAvailable sounds are: ree, rickroll, thomas, running, gas, rasputin, gear, sounds, call, callremix, trailer, uuua, countdown, ymca, distract, mii, spin - or send a YouTube link!");
					return;
				}
				if (selected) {
					stream = ytdl(selected, {
						filter: 'audioonly'
					});
					dispatcher = connection.play(stream);
					loading = msg.channel.send("loading " + arg + ", hold on...\n(if this doesn't change, try again in a minute)");
					dispatcher.on('start', () => function () {
						loading.send("ok, playing " + arg);
					});
					dispatcher.on('error', () => function () {
						loading.send("hmm, couldn't play " + arg + ". try again in a minute");
					});
				}
				//});
				break;
				// USEFUL COMMANDS
			case "support":
				msg.channel.send("Support server: https://discord.gg/DuAXWXv");
				break;
			case "restart":
				if (msg.author.id === "491026695244087316") {
					msg.channel.send("Wheeee! Let's get reincarnated by PM2!");
					log({
						color: config.colors.info,
						author: {
							name: "Restarting",
							icon_url: "https://i.ibb.co/556TBgw/reload.png"
						},
						title: "Restarting...",
						description: msg.author.username + " requested a restart.",
						timestamp: new Date(),
						footer: {
							icon_url: "",
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
					process.exit();
				} else {
					// They are not authorised.
					msg.channel.send("No.");
					log({
						color: config.colors.warning,
						author: {
							name: "Permission Denied",
							icon_url: "https://i.ibb.co/3zq37sV/permissions.png"
						},
						title: "Restart denied.",
						description: msg.author.username + " attempted to request a restart.",
						timestamp: new Date(),
						footer: {
							icon_url: "",
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				}
				break;
			case "reconnect":
				if (msg.author.id === "491026695244087316") {
					msg.channel.send("'Turn it off and on again', they said...");
					log({
						color: config.colors.info,
						author: {
							name: "Reconnecting",
							icon_url: "https://i.ibb.co/556TBgw/reload.png"
						},
						title: "Reconnecting to Discord...",
						description: msg.author.username + " requested a reconnection.",
						timestamp: new Date(),
						footer: {
							icon_url: "",
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
						color: config.colors.warning,
						author: {
							name: "Permission Denied",
							icon_url: "https://i.ibb.co/3zq37sV/permissions.png"
						},
						title: "Reconnection denied.",
						description: msg.author.username + " attempted to request a reconnection.",
						timestamp: new Date(),
						footer: {
							icon_url: "",
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				}
				break;
			case "shutdown":
				if (msg.author.id === "491026695244087316") {
					msg.channel.send("Right, off to kill myself.");
					log({
						color: config.colors.error,
						author: {
							name: "Shutting Down",
							icon_url: "https://i.ibb.co/GxXH2Wm/shutdown.png"
						},
						title: "Shutting down bot...",
						description: msg.author.username + " requested a shutdown.",
						timestamp: new Date(),
						footer: {
							icon_url: "",
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
						color: config.colors.warning,
						author: {
							name: "Permission Denied",
							icon_url: "https://i.ibb.co/3zq37sV/permissions.png"
						},
						title: "Shutdown denied",
						description: msg.author.username + " attempted to request a shutdown.",
						timestamp: new Date(),
						footer: {
							icon_url: "",
							text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
						}
					});
				}
				break;
		}
		//#endregion
	} catch (e) {
		msg.channel.send("You broke something. Well done. Please report this in the support server (`%support`)!\n", e).then(sentMessage => {
			sentMessage.react('👏');
		});
		console.log("Error: ", e);
		log({
			color: config.colors.error,
			author: {
				name: "Error",
				icon_url: "https://i.ibb.co/GMfJcN5/error.png"
			},
			title: "Exception Thrown",
			fields: [{
					name: "Error Details:",
					value: e
				},
				{
					name: "Please report this error in the support server:",
					value: "https://discord.gg/DuAXWXv"
				}
			],
			timestamp: new Date(),
			footer: {
				icon_url: "",
				text: "Channel: " + msg.channel.name + " - User: " + msg.author.username
			}
		});
	}
});

process.on('unhandledRejection', error => function () {
	ch = client.channels.cache.get(config.channels.general);
	ch.send("Welp, Unhandled Promise Rejection. Please report this in the support server (`%support`)!");
	console.error('Uncaught Promise Rejection: ', error);
	log({
		color: config.colors.error,
		author: {
			name: "Error",
			icon_url: "https://i.ibb.co/GMfJcN5/error.png"
		},
		title: "Unhandled Promise Rejection",
		fields: [{
				name: "Error Details:",
				value: error
			},
			{
				name: "Please report this error in the support server:",
				value: "https://discord.gg/DuAXWXv"
			}
		],
		timestamp: new Date(),
		footer: {
			icon_url: "",
			text: "Automated message."
		}
	});
});

client.login(secret.token);