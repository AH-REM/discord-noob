'use_strict';

/**
 * @param {Client} client
 */
module.exports = client => {

    const { bot, options } = client;

    console.log(`${bot.user.tag} is online and ready to serve ${bot.guilds.cache.size} servers.`);

    // Set the client user's status
    bot.user.setStatus(options.status).catch(console.error);

    // Set the client user's presence
    if (options.activity) {
        bot.user.setPresence({ activity: options.activity }).catch(console.error);
    }

};
