'use strict';

const Util = require('../util/Util');

class Action {

    constructor(client, name, values = {}) {

        this.client = client;
        this.name = name;

        let { script, options } = values;

        this.options = options || new Object();

        script = script || 'ready';
        this.script = require(Util.getCurrentPath(client.options.scripts + script));

    }

    /**
     * @param {Discord.Client} bot
     */
    run(bot) {
        this.script(bot, this.options);
    }

}

module.exports = Action;
