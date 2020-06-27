'use strict';

const Discord = require('discord.js');
const { DefaultOptions } = require('../util/Constants');
const EventLoader = require('./events/EventLoader');
const Loader = require('./loader/Loader');
const Managers = require('../managers/Managers');
const SlugManager = require('../managers/SlugManager');

class Client extends Discord.Client{

    /**
     * @param {Object} options - Options for the client
     */
    constructor(options = {}) {

        super();

        /**
         * Sets default properties on an object that aren't already specified.
         * @type {Object}
         */
        this.noobOptions = Discord.Util.mergeDefault(DefaultOptions, options);

        this.managers = new Managers();

        this.slugs = new SlugManager(this);

    }

    start() {
        this.login(this.noobOptions.token)
            .catch(console.error)
            .then(() => {this.managers['command'].verifyAvailability();
                         this.managers['action'].verifyAvailability();} );
    }

    /**
     * @param {string} action
     * @param {string} filename
     * @return {Promise<Error|void>}
     */
    load(action, filename) {
        return new Promise((resolve, reject) => {

            const res = Loader.load(this, action, filename);
            EventLoader(this);

            if (res instanceof Error) reject(res);
            else resolve();

        });
    }

    /**
     * @param {string} name
     */
    addSlug(name) {
        this.slugs.add(name);
    }

}

module.exports = Client;
