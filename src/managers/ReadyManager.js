'use strict';

const Action = require('../structures/Action');

class ReadyManager {

    constructor() {
        this.cache = new Map();
    }

    /**
     * @param {Client} client
     * @param {Object} json
     */
    load(client, json) {

        for (let [ name, values ] of Object.entries(json)) {

            const action = new Action(client, name, values);

            this.cache.set(name, action);

        }

    }

}

module.exports = ReadyManager;
