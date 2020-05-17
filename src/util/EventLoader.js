'use_strict';

const reqEvent = event => require(`../event/${event}`);

/**
 * @param {Client} client
 */
module.exports = client => {

    client.bot.on('ready', () => reqEvent('ready')(client));

    client.bot.on('message', message => reqEvent('message')(client, message));

};
