'use strict';

const Discord = require('discord.js');

module.exports = (client, eventEmitter, arg) => {

    switch (true) {
        case eventEmitter instanceof Discord.Message:
            return eventEmitter.member;
        default:
            return;
    }

}
