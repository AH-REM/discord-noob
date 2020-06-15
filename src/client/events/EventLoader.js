'use_strict';

const req = event => require(`./${event}`);

/**
 * @param {Client} client
 */
module.exports = client => {

    client.on('ready', () => req('ready')(client));

    client.on('message', message => req('message')(client, message));

};
