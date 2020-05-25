'use strict';

/**
 * Options for a client.
 * @return {Object}
 */
exports.DefaultOptionsClient = {

    prefix: '!',

    status: 'online',

    activity: {

        name: 'test',
        type: 'PLAYING'

    }

};

/**
 * Options for a command.
 * @return {Object}
 */
exports.DefaultOptionsCommand = {

    prefix: true,
    unique: false,
    message: {
        content: new Array(),
        react: new Array()
    },
    delete: false

};
