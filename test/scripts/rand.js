'use strict';

// const Noob = require('discord-noob');
const Noob = require('../../src/');

exports.run = (options, message) => {

    const response = Noob.parserMessage(options.message, message.member);

    message.channel.send(response)
        .catch(console.error);

    if (options.delete > -1)
        message.delete({timeout: options.delete});

};
