'use_strict';

const { DefaultOptionsCommand } = require('./Constants');

class Command {

    constructor(name, options = {}) {

        this.name = name;
        this.options = { ...DefaultOptionsCommand, ...options }

    }

    /**
     * @return {boolean}
     */
    isAvailable() {
        if (this.options.message) {
            if (this.options.message.send) {
                if (this.options.message.send instanceof Array) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @return {string|null}
     */
    getMessage() {
        const rand = Math.floor(Math.random() * this.options.message.send.length);
        return this.options.message.send[rand];
    }

}

module.exports = Command;
