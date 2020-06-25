'use strict';

const ModuleLoader = require('../managers/ModuleManager');

class Action {

    constructor(client, event, name, values = {}) {

        this.client = client;
        this.name = name;
        this.event = event;

        this.options = values.options || new Object();

        this.script = ModuleLoader.load(client, 'script', values.script);
    }

    /**
     * @param {Client} client
     */
    run(client) {
        this.script(client, this.options);
    }

}

module.exports = Action;
