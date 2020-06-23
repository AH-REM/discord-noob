'use strict';

const ModuleManager = require('../managers/ModuleManager');

class Check {
    constructor(client, name, options) {
        this.check = ModuleManager.load(client, 'check', name);

        this.options = options? options : {};

        this.onError = options.onError ? ModuleManager.load(client, 'script', options.onError) : null;
    }

    /**
     * Verifies that the check condition is fulfilled, if not silent it'll also run the onError script when it doesn't.
     * @param eventEmitter
     * @param silent
     * @returns {boolean}
     */
    validate(eventEmitter, silent) {
        if (this.check.run(this.options, eventEmitter)) {
            return true;
        } else if (!silent && this.onError){
            const func = this.onError.run || this.onError;
            if (func)
                func(this.options, eventEmitter);
        }
        return false;
    };
}

module.exports = Check;
