'use strict';

const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const Util = require('../util/Util');

/**
 * An API for the modules to store and retrieve persistent data through the bot, without having to do it themselves.
 */
class DataStorage {
    constructor(client) {
        this.client = client;
        this.cache = new Map();
        this.dataDir = Util.getCurrentPath(client.noobOptions.data);

        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir);
        }

        this.reload();
    }

    set(name, value) {
        this.cache.set(name, value);

        const data = YAML.stringify(value);
        fs.writeFileSync(path.join(this.dataDir, name + ".yml"), data);
    }

    get(name) {
        return this.cache.get(name) || {};
    }

    /**
     * Fills up the cache with the persistent data from the files.
     */
    reload() {
        for (let filename of fs.readdirSync(this.dataDir)) {
            const data = fs.readFileSync(path.join(this.dataDir, filename), { encoding:'utf8', flag:'r' });
            const json = YAML.parse(data);

            this.cache.set(filename.replace(/.yml$/, ''), json);
        }
    }

}

module.exports = DataStorage;