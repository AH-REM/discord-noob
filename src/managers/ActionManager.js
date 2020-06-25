'use strict';

const Action = require('../structures/Action');

class ActionManager {

    constructor() {
        this.cache = ActionManager.eventList();
    }

    /**
     * @param {Client} client
     * @param {Object} json
     */
    load(client, json) {

        for (let [ name, values ] of Object.entries(json)) {
            let event = ActionManager.eventDict(values.event);
            if (event) {
                const action = new Action(client, event, name, values);

                this.cache.get(event).set(name, action);
            }
        }

    }

    static eventList() {
        return new Map([['ready',new Map()],['reaction',new Map()]]);
    }

    static eventDict(name) {
        let dict = {ready: 'ready',
                    messageReactionAdd: 'reaction', messageReactionRemove: 'reaction', messageReactionRemoveAll: 'reaction', messageReactionRemoveEmoji: 'reaction'
        }

        return dict[name];
    }
}

module.exports = ActionManager;
