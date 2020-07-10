'use strict';

const { DefaultCommand } = require('../util/Constants');
const Check = require('./Check');
const ModuleManager = require('../managers/ModuleManager');

class Command {

    constructor(client, prefixDefault, name, values = {}) {

        this.client = client;
        this.available = true;
        this.name = name;
        this.values = values;

        this.prefix = values.prefix !== undefined ? values.prefix : prefixDefault;

        this.aliases = values.aliases ? values.aliases : new Array();

        this.values.options = this.values.options || {};

        this.options = this.values.options[values.script] || new Object();

        this.checks = values.checks ? values.checks.map((name) => new Check(client, this, name, values.options[name])) : [];

        this.script = ModuleManager.load(client, 'script', values.script);

        this.func = this.script.run || this.script;

        this.available = true;

        if (this.values.options.definedArgCount)
            this.calculateArgCount();
    }

    /**
     * @return {boolean}
     */
    isAvailable() {
        if (this.script.isAvailable) {
            if (!!this.script.isAvailable(this.options, this.client) !== this.available) {
                this.available = !this.available;
                console.error(`The command ${this.name} has been ${this.available? 're-enabled' : 'disabled'}.`)
            }
        }
        this.checks.forEach(check => check.isAvailable());
        return this.available;
    }

    /**
     * Checks that the message that called the Command fulfils all
     * @param message
     * @param silent - if the check should perform the onError script or jus run silently.
     *
     * @returns {boolean}
     */
    validateChecks(message, silent) {
        let eventEmitter = {event: 'command', eventArgs: [message]};
        for (let check of this.checks) {
            if (check.available && !check.validate(eventEmitter, silent)) {
                return false;
            }
        }
        return true;
    }

    /**
     * @param eventEmitter
     * @param {string[]} args
     */
    action(eventEmitter, args) {
        eventEmitter.arguments = args;
        this.func(this.options, eventEmitter, ...args);
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

    /**
     * Calculates the min and maxArgs, first by the setting provided, then by the script calculation, then by the custom usage
     * provided and finally by the usage automatically parsed.
     */
    calculateArgCount() {
        this.values.options.minArgs = this.values.options.minArgs ||
            (this.script.calcMin ? this.script.calcMin(this.client, this.options) :
            Math.max(this.func.length - 2, 0));

        this.values.options.maxArgs = this.values.options.maxArgs ||
            (this.script.calcMax ? this.script.calcMax(this.client, this.options) : null) ||
            (this.values.usage ? this.values.usage.split(' ').length :
                Command.usageParser(this).length ? Command.usageParser(this).split(' ').length : 0);

        console.log(`The command ${this.name} has a defined argument count range: [${this.values.options.minArgs}, ${this.values.options.maxArgs}]`)
    }
}

module.exports = Command;
