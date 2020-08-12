'use strict';

// const Noob = require('discord-noob');
const Noob = require('../../index');

module.exports = (options, eventEmitter) => {

    if (options.content) {

        let message = options.content;

        if (options.parse) {
            message = Noob.parserMessage(eventEmitter.client, eventEmitter, message);
        }

        console.log(message);
    }

};
