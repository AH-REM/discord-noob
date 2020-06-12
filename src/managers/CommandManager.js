'use strict';

const Command = require('../structures/Command');

class CommandManager {

    constructor() {
        this.cache = {
            commands: new Map(),
            aliases: new Map()
        }
    }

    /**
     * @param {Client} client
     * @param {Object} json
     */
    load(client, json) {

        const { prefix } = client.options;

        for (let [ name, options ] of Object.entries(json)) {

            const cmd = new Command(client, name, options);
            if (cmd.isAvailable()) {

                name = cmd.options.prefix ? prefix + name : name;

                this.cache.commands.set(name, cmd);

                for (let alias of cmd.options.aliases) {
                    alias = cmd.options.prefix ? prefix + alias : alias;
                    this.cache.aliases.set(alias, name);
                }

            }
            else throw `The command ${name} has not message to send.`;

        }

    }

}

module.exports = CommandManager;
