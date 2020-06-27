'use_strict';

/**
 * List of events than need a specific loader.
 * @type {string[]}
 */
const specificEvents = ['ready', 'message'];
const req = event => require(`./${event}`);

/**
 * @param {Client} client
 */
module.exports = function(client){

    for (let event of client.managers['action'].cache.keys()) {
        console.log(`Loading event "${event}"`);
        if (specificEvents.includes(event))
            client.on(event, function(...args){req(event)(client, ...args)})
        else
        client.on(event, function(...args){req('default')(client, event, args)});
    }

};
