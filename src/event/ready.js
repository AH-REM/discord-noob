'use_strict';

/**
* @param {Client} client
*/
module.exports = client => {

    const { bot } = client;

    console.log(`${bot.user.tag} is online and ready to serve ${bot.guilds.cache.size} servers.`);

};
