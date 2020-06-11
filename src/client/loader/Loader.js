'use strict';

const fs = require('fs');
const YAML = require('yaml');
const Util = require('../../util/Util');

class Loader {

    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    /**
     * @param {Client} client
     * @param {string} action
     * @param {string} filename
     */
    static async load(client, action, filename) {
        try {

            const Manager = client.managers[action.toLowerCase()];
            if (!Manager) throw `The ${action} manager does not exist.`;

            const path = Util.getCurrentPath(filename); // edit l'erreur

            const data = fs.readFileSync(path, { encoding:'utf8', flag:'r' });
            const json = YAML.parse(data);

            await Manager.load(client, json);

        }
        catch (err) {
            throw err;
        }
    }

}

module.exports = Loader;
