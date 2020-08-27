'use strict';

const ModuleManager = require('../managers/ModuleManager');

class Check {
    constructor(client, action, name, options) {
        this.client = client;
        this.available = true;
        this.action = action;
        this.name = name;

        this.check = ModuleManager.load(client, 'check', name);

        this.options = options || {};

        if (this.options.onError) {
            this.onError = ModuleManager.load(client, 'script', this.options.onError);
            this.scriptOptions = this.options[this.options.onError];
        }
    }

    /**
     * Verifies that the check condition is fulfilled, if not silent it'll also run the onError script when it doesn't.
     * @param eventEmitter
     * @param silent
     * @returns {boolean}
     */
    validate(eventEmitter, silent) {
        eventEmitter.check = this;
        if (this.check.run(this.options, eventEmitter)) {
            return true;
        } else if (!silent && this.onError){
            const func = this.onError.run || this.onError;
            if (func)
                func(this.scriptOptions, eventEmitter);
        }
        return false;
    };

    /**
     * @return {boolean}
     */
    isAvailable() {
        if (this.check.isAvailable) {
            if (!!this.check.isAvailable(this.options, this.client) !== this.available) {
                this.available = !this.available;
                console.error(`The check ${this.name} from the action ${this.action.name} has been ${this.available? 're-enabled' : 'disabled'}.`)
            }
        }
        return this.available;
    }

    disable() {
        console.error(`The check ${this.name} from the action ${this.action.name} has been disabled.`)
        this.available = false;
    }
}

module.exports = Check;
