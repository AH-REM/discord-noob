'use strict';

/**
 * Options for a client.
 * @return {Object}
 */
exports.DefaultOptions = {

    prefix: '!',

    status: 'online',

    // activity: {
    //
    //     name: 'test',
    //     type: 'PLAYING'
    //
    // }

};

/**
 * Options for a command.
 * @return {Object}
 */
exports.DefaultCommand = {

    prefix: true,
    unique: false,
    script: 'message',
    script_options: {
        guild: null,
        channel: null,
        content: new Array(),
        react: new Array()
    },
    aliases: new Array(),
    delete: -1

};
