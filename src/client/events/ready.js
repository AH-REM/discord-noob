'use_strict';

/**
 * @param {Client} client
 */
module.exports = client => {

    const { noobOptions } = client;

    console.log(`${client.user.tag} is online and ready to serve ${client.guilds.cache.size} servers.`);

    // Set the client user's status
    if (noobOptions.status)
        client.user.setStatus(noobOptions.status).catch(console.error);

    // Set the client user's presence
    if (noobOptions.activity) {
        client.user.setPresence({ activity: noobOptions.activity }).catch(console.error);
    }

    // Validate Actions
    client.validateActions();

    // Exec all action
    let eventEmitter = {event: 'ready', eventArgs: [], client: client};
    for (let [ _, action ] of client.managers['action'].cache.get('ready')) {
        action.run(eventEmitter);
    }

};
