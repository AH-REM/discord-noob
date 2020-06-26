'use strict';

const ModuleLoader = require('../managers/ModuleManager');

class Action {

    constructor(client, name, values = {}) {

        this.client = client;
        this.name = name;
        this.event = values.event;

        this.options = values.options || new Object();

        this.script = ModuleLoader.load(client, 'script', values.script);
    }

    /**
     * @param {Client} client
     * @param {Object} eventEmitter
     */
    run(eventEmitter) {
        this.script(this.options, eventEmitter);
    }

}

module.exports = Action;
