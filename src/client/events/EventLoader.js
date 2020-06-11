'use_strict';

const req = event => require(`./${event}`);

/**
 * @param {Client} client
 */
module.exports = client => {

    const { bot } = client;

    bot.on('ready', () => req('ready')(client));

    bot.on('message', message => req('message')(client, message));

};
