'use strict';

const Discord = require('discord.js');

const { DefaultOptions } = require('../util/Constants');
const EventLoader = require('../util/EventLoader');

class Client {

    /**
     * @param {Object} [options] Options for the client
     */
    constructor(options = {}) {

        this.options = { ...DefaultOptions, ...options }
        this.bot = new Discord.Client();

        EventLoader(this);
        this.login();

    }

    login() {
        this.bot
            .login(this.options.token)
            .catch(console.error);
    }

}

module.exports = Client;
