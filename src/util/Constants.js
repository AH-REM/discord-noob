'use strict';

/**
 * Options for a client.
 * @return {Object}
 */
exports.DefaultOptionsClient = {

    prefix: '!'

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
