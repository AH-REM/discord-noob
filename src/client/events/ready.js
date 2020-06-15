'use_strict';

/**
 * @param {Client} client
 */
module.exports = client => {

    const { noobOptions } = client;

    console.log(`${client.user.tag} is online and ready to serve ${client.guilds.cache.size} servers.`);

    // Set the client user's status
    client.user.setStatus(noobOptions.status).catch(console.error);

    // Set the client user's presence
    if (noobOptions.activity) {
        client.user.setPresence({ activity: noobOptions.activity }).catch(console.error);
    }

    // Exec all action
    for (let [ name, action ] of client.managers['ready'].cache) {
        action.run(bot);
    }

};
