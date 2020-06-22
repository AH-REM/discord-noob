'use strict';

const Util = require('../util/Util');

class Check {
    constructor(client, name, options) {
        this.check = require(Util.getCurrentPath(client.noobOptions.checks + name));

        this.options = options? options : {};

        this.onError = options.onError ?
             require(Util.getCurrentPath(client.noobOptions.scripts + options.onError))
            :
            this.onError = null;
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
