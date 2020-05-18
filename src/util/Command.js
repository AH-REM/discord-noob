'use_strict';

const { DefaultOptionsCommand } = require('./Constants');

class Command {

    constructor(name, options = {}) {

        this.name = name;
        this.options = { ...DefaultOptionsCommand, ...options }

        // force add content in the object
        this.options.message = { ...DefaultOptionsCommand.message, ...this.options.message }

    }

    /**
     * @return {boolean}
     */
    isAvailable() {
        if (this.options.message.content instanceof Array) return true;
        // test react
        return false;
    }

    /**
     * @return {string|null}
     */
    getMessage() {
        const rand = Math.floor(Math.random() * this.options.message.content.length);
        return this.options.message.content[rand];
    }

    /**
     * @param {Message}
     */
    addReact(message) {
        if (this.options.message.react.length < 1) return;
        for (let emoji of this.options.message.react) {
            message.react(emoji).catch(console.error);
        }
    }

}

module.exports = Command;
