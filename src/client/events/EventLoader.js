'use_strict';

const ActionManager = require('../../managers/ActionManager');

const specificEvents = ['ready'];
const req = event => require(`./${event}`);

/**
 * @param {Client} client
 */
module.exports = function(client){

    client.on('ready', () => req('ready')(client));

    client.on('message', message => req('message')(client, message));

    for (let event of client.managers['action'].cache.keys()) {
        if (event in specificEvents) continue;
        client.on(event, function(...args){req('default')(client, event, args)});
    }
};
