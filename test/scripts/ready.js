'use strict';

// const Noob = require('discord-noob');
const Noob = require('../../src/');

module.exports = (client, options) => {

    if (options.console) {

        let message = options.console;

        if (options.parse) {
            message = Noob.parserMessage(client, client, message);
        }

        console.log(message);
    }

};
