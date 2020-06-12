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
    aliases: new Array(),
    options: new Object()
    
};
