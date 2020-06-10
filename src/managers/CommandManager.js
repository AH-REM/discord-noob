'use strict';

class CommandManager {

    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    /**
     * @param {Object} json
     */
    static load(json) {
        return 'true';
    }

}

module.exports = CommandManager;
