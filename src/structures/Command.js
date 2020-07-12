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

        this.options = this.values.options || {};

        this.scriptOptions = this.options[values.script] || {};

        this.checks = values.checks ? values.checks.map((name) => new Check(client, this, name, this.options[name])) : [];

        this.script = ModuleManager.load(client, 'script', values.script);

        this.func = this.script.run || this.script;

        this.available = true;

        if (this.options.definedArgCount)
            this.calculateArgCount();
    }

    /**
     * @return {boolean}
     */
    isAvailable() {
        if (this.script.isAvailable) {
            if (!!this.script.isAvailable(this.scriptOptions, this.client) !== this.available) {
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
        this.func(this.scriptOptions, eventEmitter, ...args);
    }

    /**
     * Parses the Command's script to get the arguments it requires.
     * @param cmd
     * @return {string}
     */
    static usageParser(cmd) {
        let func = cmd.script.run || cmd.script;
        let string = func.toString();
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
        args = args.map((word) => word.includes("=") || word.includes("...") ? `[${word.split("=")[0]}]` : word);
        return args.slice(2).join(" ");
    }

    static usageToArgCount(usage) {
        if (!usage.length) return 0;
        let args = usage.split(" ");
        return args[args.length - 1].includes('...') ? Infinity : args.length;
    }

    /**
     * Calculates the min and maxArgs, first by the setting provided, then by the script calculation, then by the custom usage
     * provided and finally by the usage automatically parsed.
     */
    calculateArgCount() {
        this.options.minArgs = this.options.minArgs ||
            (this.script.calcMin ? this.script.calcMin(this.client, this.scriptOptions) :
            Math.max(this.func.length - 2, 0));

        this.options.maxArgs = this.options.maxArgs ||
            (this.script.calcMax ? this.script.calcMax(this.client, this.scriptOptions) : null) ||
             Command.usageToArgCount(this.values.usage || Command.usageParser(this));

        console.log(`The command ${this.name} has a defined argument count range: [${this.values.options.minArgs}, ${this.values.options.maxArgs}]`)
    }
}

module.exports = Command;
