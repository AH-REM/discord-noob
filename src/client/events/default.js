'use_strict';

/**
 * @param {Client} client
 * @param {string} eventName
 * @param {Array} args
 */
module.exports = function(client, eventName, args ){
    // Exec all actions
    let eventEmitter = {event: eventName, args: args, client: client};
    for (let [ _, action ] of client.managers['action'].cache.get(eventName)) {
        action.run(eventEmitter);
    }
};