'use strict';

const Discord = require('discord.js');
const { DefaultOptions } = require('../util/Constants');
const EventLoader = require('./events/EventLoader');

class Client {

    /**
     * @param {Object} options - Options for the client
     */
    constructor(options = {}) {

        this.bot = new Discord.Client();

        /**
         * Sets default properties on an object that aren't already specified.
         * @type {Object}
         */
        this.options = Discord.Util.mergeDefault(DefaultOptions, options);

        /**
         * Load all listeners.
         */
        EventLoader(this);

    }

    start() {
        this.bot
            .login(this.options.token)
            .catch(console.error);
    }

    load() {
        console.log('loader?');
    }

}

module.exports = Client;
