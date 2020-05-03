const Discord = require("discord.js");
const fetch = require('node-fetch');
var HttpsProxyAgent = require('https-proxy-agent');
require('tls').DEFAULT_MIN_VERSION = 'TLSv1';

module.exports.run = (client, message, args) => {
	try {
	//console.log(args.length);
	//console.log(args);
	var server;
	var character;
	if(args.length == 0) {
		message.channel.send("Please provide at least an ingame name!");
	} else if(args.length != 0) {
		if(args.length == 1) {
			server = "ps2:v2";
			character = args[0];
		} else {
			if(args[1] == "ps4eu") {
				server = "ps2ps4eu:v2";
				character = args[0];
			}
			if(args[1] == "ps4us") {
				server = "ps2ps4us:v2";
				character = args[0];
			}
		}
		console.log('https://census.daybreakgames.com/s:lobster/get/'+ server +'/character/?name.first_lower=' + character + '&c:join=characters_online_status&c:limit=5000');
	fetch('https://census.daybreakgames.com/s:lobster/get/'+ server +'/character/?name.first_lower=' + character + '&c:join=characters_online_status&c:limit=5000'/*, { agent:new HttpsProxyAgent('https://census.daybreakgames.com')}*/).then(res => res.json())
	.then(json => {
		//console.log(json);
		if(json.returned == 1) {
		PlayerData = json.character_list;
		//console.log(PlayerData);
		let reformattedArray = PlayerData.map(obj => {
			//console.log(obj.certs.available_points);
			//console.log(obj);
			var color;
			var FactionIcon;
			var IsOnline = "Offline";
			if(obj.faction_id == '1') {
				color = '#9B59B6';
				FactionIcon = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR4I064NB2ZUFYOIfQBLDGVgCB9TuDwsEr77MKAAyU9igDO0Djk";
			} else if(obj.faction_id == '2') {
				color = '0x0079a8';
				FactionIcon = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQjKLGG8yDkkvNXX3iNGt2qc5NjgygSce6NHJnqPkk2zX6SDSPO";
			} else if(obj.faction_id == '3') {
				color = '#F93A2F';
				FactionIcon = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTP-gWOBRd9OP9okyPYGE8qiHmWCJOhoyfLaE07jZiI3i6pUG2q";
			} else {
				color = '#91A6A6';
			}
			if(obj.character_id_join_characters_online_status.online_status != '0'){
				IsOnline = "Online";
			}
			let embed = new Discord.RichEmbed()
				.setAuthor(obj.name.first/* + " (" + obj.character_id +")"*/)
				.setDescription("lv. " + obj.battle_rank.value + "      (" + obj.battle_rank.percent_to_next + "% to next)")
				.setColor(color)
				.setThumbnail(FactionIcon)
				.addField('Prestige level:', obj.prestige_level)
				.addField('Availble Certs:', obj.certs.available_points)
				.addField('Total playtime:', obj.times.minutes_played + "mins")
				.addField('Last online:', obj.times.last_save_date)
				.addField('Created:', obj.times.creation_date)
				.setFooter('Player is currently ' + IsOnline);
			message.channel.send({embed: embed});
		});
		} else { message.channel.send("Couldnt find that name in our database! Try another server."); }
	});
	}
	} catch(err) { 
		console.log(err);
		message.channel.send("Couldnt find that name in our database!");
	}
};

module.exports.help = {
	name: "ps2stats",
	desc: "Show ingame character info"
};