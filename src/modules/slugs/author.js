'use strict';

const Discord = require('discord.js');

module.exports = (client, eventEmitter, arg) => {

    switch (eventEmitter.event) {
        case 'command':
        case 'message':
            return eventEmitter.member;
        default:
            return;
    }

}
