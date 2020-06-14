'use strict';

const Util = require('../util/Util');

class Check {
    constructor(client, name, options) {
        this.check = require(Util.getCurrentPath(client.options.checks + name));

        this.options = options? options : {};

        this.onError = require(Util.getCurrentPath(client.options.scripts + options.onError));
    }

    /**
     * Verifies that the check condition is fulfilled, if not silent it'll also run the onError script when it doesn't.
     * @param message
     * @param silent
     * @returns {boolean}
     */
    validate(message, silent) {
        if (this.check.run(this.options, message)) {
            return true;
        } else if (!silent){
            const func = this.onError.run || this.onError;
            func(this.options, message);
        }
        return false;
    };
}

module.exports = Check;
