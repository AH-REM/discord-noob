'use strict';

const ModuleLoader = require('../managers/ModuleManager');
const Check = require('./Check');

class Action {

    constructor(client, name, values = {}) {

        this.client = client;
        this.name = name;
        this.events = values.event instanceof Array? values.event: [values.event];
        this.available = true;

        this.options = values.options || {};
        this.scriptOptions = this.options[values.script] || {};

        this.script = ModuleLoader.load(client, 'script', values.script);
        this.checks = values.checks ? values.checks.map((name) => new Check(client, this, name, this.options[name])) : [];
    }

    /**
     * @param eventEmitter
     */
    run(eventEmitter) {
        let func = this.script.run || this.script;
        if (this.validateChecks(eventEmitter, false))
            func(this.scriptOptions, eventEmitter);
    }

    validateChecks(eventEmitter, silent) {
        for (let check of this.checks) {
            if (check.available && !check.validate(eventEmitter, silent)) {
                return false;
            }
        }
        return true;
    }

    isAvailable() {
        if (this.script.isAvailable) {
            if (!!this.script.isAvailable(this.options, this.client) !== this.available) {
                this.available = !this.available;
                console.error(`The action ${this.name} has been ${this.available? 're-enabled' : 'disabled'}.`)
            }
        }
        this.checks.forEach(check => check.isAvailable());
        return this.available;
    }

    disable() {
        console.error(`The action ${this.name} has been disabled.`)
        this.available = false;
    }
}

module.exports = Action;
