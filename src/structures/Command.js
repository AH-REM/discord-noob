'use strict';

const { DefaultCommand } = require('../util/Constants');
const Util = require('../util/Util');
const Check = require('./Check');

class Command {

    constructor(client, prefixDefault, name, values = {}) {
      
        this.client = client;
        this.name = name;
        this.values = values;

        this.prefix = values.prefix !== undefined ? values.prefix : prefixDefault;

        this.aliases = values.aliases ? values.aliases : new Array();

        this.script = values.script ? values.script : 'message';

        this.options = values.options ? values.options : new Object();

        this.checks = values.checks ? values.checks.map((name) => new Check(client, name, this.options[name])) : [];

        this.script = require(Util.getCurrentPath(client.noobOptions.scripts + this.script));

        // Setting up some properties if
        const func = this.script.run || this.script;
        this.options.minArgs = this.options.minArgs || Math.max(func.length - 2, 0);

        this.options.maxArgs = this.options.maxArgs ||
            this.values.usage ? this.values.usage.split(' ').length :
            Command.usageParser(this).split(' ').length
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

    /**
     * Parses the Command's script to get the arguments it requires.
     * @param cmd
     * @return {string}
     */
    static usageParser(cmd) {
        let funct = cmd.script.run || cmd.script;
        let string = funct.toString();
        let start = -1, stop = 0, inQuote = false, quote;
        for (let charIndex in string.split("")) {
            if (start === -1 && string[charIndex] === '(') {
                start = Number(charIndex);
            }
            else if (start !== -1 && !inQuote && string[charIndex].match(/["'`]/)) {
                quote = string[charIndex];
                inQuote = true;
            }
            else if (start !== -1 && !inQuote && string[charIndex] === ')') {
                stop = Number(charIndex);
                break;
            }
            else if (start !== -1 && inQuote && string[charIndex] === quote)
                inQuote = false;
        }
        let args = string.substr(start + 1, stop - start - 1)
            .replace(/ /g, "")
            .replace(/,/g, " ")
            .split(" ");
        args = args.map((word) => word.includes("=") ? `[${word.split("=")[0]}]` : word);
        return args.slice(2).join(" ");
    }
}

module.exports = Command;
