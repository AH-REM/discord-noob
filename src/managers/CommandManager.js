'use strict';

const Command = require('../structures/Command');

class CommandManager {

    constructor(prefix = true) {
        this.cache = {
            commands: new Map(),
            aliases: new Map()
        };
        this.prefix = prefix;
    }

    /**
     * @param {Client} client
     * @param {Object} json
     */
    load(client, json) {

        for (let [ name, values ] of Object.entries(json)) {
            let cmd;

            if (values.commands) {
                let Group = require('../structures/Group'); // Not at the top bcs it causes a circular dependency.
                cmd = new Group(client, this.prefix, name, values);
            }
            else {
                cmd = new Command(client, this.prefix, name, values);
            }


            this.cache.commands.set(name, cmd);

            for (let alias of cmd.aliases) {
                this.cache.aliases.set(alias, cmd);
            }

        }

    }

    verifyAvailability() {
        this.cache.commands.forEach(cmd => cmd.isAvailable());
    }

}

module.exports = CommandManager;
