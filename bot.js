const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json")
const table = require("table")
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({status: 'online', game: {name: 'try $help'}});
});
client.login(auth.token);
client.on('message', msg => {
    if (msg.content.substring(0, 1) == '$') {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            case 'help':
              msg.reply('```help - shows a list of commands\nree - takes a whole number and makes a "ree" with that many Es\npubg - takes a username in PUBG and displays latest stats```');
              break;
            case 'ree':
                var send = 'r';
                var arg = parseInt(args[0]);
                if (arg != args[0]){
                  msg.reply("Argument must be a whole number")
                } else if (arg > 1999){
                  msg.reply("Number cannot exceed 1999")
                } else {
                  console.log(arg);
                  for (i = 0; i < arg; i++) {
                    send = send + 'e';
                  };
                  msg.reply(send)
                }
            break;
            case 'pubg':
              name = args[0];
              season = args[1];
              const request = require("request");
              const key = 'f4e80a25-dd22-48ea-b5d5-6074b4b29878'
              const url =
              "https://api.pubgtracker.com/v2/profile/pc/" + name+"?region=na&season=2017-pre5";
              const options = {
                  url: url,
                  method: 'GET',
                  headers: {
                      'TRN-Api-Key': key,
                  }
              };
              request(options, function(error, response, body)  {
                console.log("Request went through for "+ name)
                let json = JSON.parse(body);
                console.dir(json)
                let stats = json.stats;
                if (typeof stats == 'undefined') {
                  bot.sendMessage({
                    to: channelID,
                    message: "Couldn't find name" + '"'+name+'"'
                  });
                } else {
                  stats = stats.filter(o => o.season=='2017-pre5')
                  var newStats;
                  var data = [];
                  var message;
                  var header_row = [name];
                  var rating = ['Rating'];
                  var rounds = ['Rounds Played'];
                  var wins = ['Wins'];
                  var winPer = ['Win %'];
                  var topTen = ['Top 10 %'];
                  var kdRatio = ['K/D Ratio'];
                  var dmg = ['Avg Dmg'];
                  for (i = 0; i < stats.length; i ++) {
                      var rating;
                      newStats = stats[i].stats;
                      header_row.push(stats[i].mode)
                      rating.push(newStats[9].value)
                      rounds.push(newStats[3].value)
                      wins.push(newStats[4].value)
                      winPer.push(newStats[1].value)
                      topTen.push(newStats[7].value)
                      kdRatio.push(newStats[0].value)
                      dmg.push(newStats[12].value)
                    };
                  data.push(header_row, rating, rounds, wins, winPer, topTen, kdRatio, dmg)
                  message = "```\n"+table.table(data)+"```"
                  console.log(message)
                    // message = "```"
                    //           +"\nName: "+name
                    //           +"\nMode: "+stats[i].mode
                    //           +"\nRating: " + newStats[9].value
                    //           +"\nRounds Played* " + newStats[3].value
                    //           +"\nWins: " + newStats[4].value
                    //           +"\nWin %: " + newStats[1].value
                    //           +"%\nTop 10 %: " + newStats[7].value
                    //           +"%\nK/D Ratio: " + newStats[0].value
                    //           +"\nAvg Dmg: " + newStats[12].value
                              // + "```";
                    msg.reply(message)
                    }

                  //console.log(newStats);

              });

              break;
            // Just add any case commands if you want to..
          }
     }
});
