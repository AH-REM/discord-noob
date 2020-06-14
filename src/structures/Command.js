'use strict';

const { DefaultCommand } = require('../util/Constants');
const Util = require('../util/Util');
const Check = require('./Check');

class Command {

    constructor(client, prefixDefault, name, values = {}) {
      
        this.client = client;
        this.name = name;

        const { prefix, unique, aliases, script } = values;

        this.prefix = prefix !== undefined ? prefix : prefixDefault;

        this.unique = unique !== undefined ? unique : false;

        this.aliases = aliases ? aliases : new Array();

        this.script = script ? script : 'message';

        this.options = values.options ? values.options : new Object();

        this.checks = values.checks ? values.checks.map((name) => new Check(client, name, this.options[name])) : [];

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
     * Checks that the message that called the Command fulfils all
     * @param message
     * @param silent - if the check should perform the onError script or jus run silently.
     *
     * @returns {boolean}
     */
    validateChecks(message, silent) {
        for (let check of this.checks) {
            if (!check.validate(message, silent)) {
                return false;
            }
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