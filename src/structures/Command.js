'use strict';

const Discord = require('discord.js');
const Message = require('./Message');
const { DefaultCommand } = require('../util/Constants');

class Command extends Message {

    constructor(name, options = {}) {
        super();

        this.name = name;

        /**
         * Sets default properties on an object that aren't already specified.
         * @type {Object}
         */
        this.options = Discord.Util.mergeDefault(DefaultCommand, options);

    }

    /**
     * @return {boolean}
     */
    isAvailable() {
        return true;
    }

}

module.exports = Command;
