'use strict';

const Command = require('../structures/Command');

class CommandManager {

    constructor() {
        this.cache = new Map();
    }

    /**
     * @param {Client} client
     * @param {Object} json
     */
    load(client, json) {

        const { prefix } = client.options;

        for (let [ name, options ] of Object.entries(json)) {

            const cmd = new Command(name, options);
            if (cmd.isAvailable()) {

                name = cmd.options.prefix ? prefix + name : name;

                this.cache.set(name, cmd);

            }
            else throw `The command ${name} has not message to send.`;

        }

    }

}

module.exports = CommandManager;
