'use_strict';

/**
* @param {Discord.Client} bot
*/
module.exports = bot => {

    console.log(`${bot.user.tag} is online and ready to serve ${bot.guilds.cache.size} servers.`);

};
