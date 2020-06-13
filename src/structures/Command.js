'use strict';

const { DefaultCommand } = require('../util/Constants');
const Util = require('../util/Util');

class Command {

    constructor(client, name, values = {}) {

        this.client = client;
        this.name = name;

        const { prefix, unique, aliases, script } = values;

        this.prefix = prefix !== undefined ? prefix : true;

        this.unique = unique !== undefined ? unique : false;

        this.aliases = aliases ? aliases : new Array();

        this.script = script ? script : 'message';

        this.options = values.options ? values.options : new Object();

        this.script = require(Util.getCurrentPath(client.options.scripts + this.script));

        // Setting up some properties if

    }

    /**
     * @return {boolean}
     */
    isAvailable() {
        if (this.script.isAvailable) {
            return !!this.script.isAvailable();
        }
        return true;
    }

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    action(message, args) {
        const func = this.script.run || this.script;
        func(this.options, message, ...args);
    }

}

module.exports = Command;
