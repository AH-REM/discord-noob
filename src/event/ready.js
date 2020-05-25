'use_strict';

/**
* @param {Client} client
*/
module.exports = client => {

    const { bot } = client;

    console.log(`${bot.user.tag} is online and ready to serve ${bot.guilds.cache.size} servers.`);

    // Set the client user's status
    bot.user.setStatus(client.options.status).catch(console.error);

    // Set the client user's presence
    bot.user.setPresence({ activity: client.options.activity }).catch(console.error);

};
