'use strict';

const Discord = require('discord.js');

module.exports = (client, eventEmitter, arg = 0) => {

    if (!eventEmitter instanceof Discord.Message) return;

    let result;
    const nb = parseInt(arg, 10);

    if (isNaN(nb)) return;

    if (nb < 1) {
        result = eventEmitter.arguments.join(' ');
    }
    else {
        result = eventEmitter.arguments[nb];
    }

    return result;

}
