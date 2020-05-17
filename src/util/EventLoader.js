'use_strict';

const reqEvent = event => require(`../client/event/${event}`);

/**
* @param {Discord.Client} bot
*/
module.exports = bot => {

    bot.on('ready', reqEvent('ready'));

    bot.on('message', reqEvent('message'));

};
