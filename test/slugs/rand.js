'use strict';

const Discord = require('discord.js');

module.exports = (eventEmitter, arg) => {

    if (!arg) arg = 1;

    const nb = parseInt(arg, 10);
    if (!isNaN(nb)) {
        return Math.floor(Math.random() * (nb + 1));
    }

}
