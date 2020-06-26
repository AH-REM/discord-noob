'use strict';

const Action = require('../structures/Action');

class ActionManager {

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
            for (let event of ActionManager.event(values.event)) {
                if (!this.cache.has(event)) {
                    this.cache.set(event, new Map());
                }
                this.cache.get(event).set(name, action);
            }
        }
    }

    static event(name) {
        let groups = {
            ready: ['ready'],
            reaction: ['messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji']
        }

        return name in groups? groups[name]: [name];
    }
}

module.exports = ActionManager;
