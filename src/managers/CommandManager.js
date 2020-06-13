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

        //const { prefix } = client.options;

        for (let [ name, values ] of Object.entries(json)) {
            let cmd;

            if (values.commands) {
                let Group = require('../structures/Group'); // Not at the top bcs it causes a circular dependency.
                cmd = new Group(client, this.prefix, name, values);
            }
            else {
                cmd = new Command(client, this.prefix, name, values);
            }


            if (cmd.isAvailable()) {

                //name = cmd.prefix ? prefix + name : name;

                this.cache.commands.set(name, cmd);

                for (let alias of cmd.aliases) {
                    //alias = cmd.prefix ? prefix + alias : alias;
                    this.cache.aliases.set(alias, cmd);
                }

            }
            else throw `The command ${name} has not message to send.`;

        }

    }

}

module.exports = CommandManager;
