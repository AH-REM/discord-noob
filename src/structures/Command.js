'use strict';

const Discord = require('discord.js');
const { DefaultCommand } = require('../util/Constants');
const Util = require('../util/Util');

class Command {

    constructor(client, name, options = {}) {
        this.client = client;
        this.name = name;

        /**
         * Sets default properties on an object that aren't already specified.
         * @type {Object}
         */
        this.options = Discord.Util.mergeDefault(DefaultCommand, options);

        this.script = require(Util.getCurrentPath(client.options.scripts + this.options.script));
    }

    /**
     * @return {boolean}
     */
    isAvailable() {
        return true;
    }

    action(message, args) {
        this.script(this, message, ...args);
    }
}

module.exports = Command;
