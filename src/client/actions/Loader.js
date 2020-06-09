'use strict';

const fs = require('fs');
const YAML = require('yaml');
const Util = require('../../util/Util');

class Loader {

    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    /**
     * @param {string} action
     * @param {string} filename
     */
    static load(action, filename) {
        try {

            const path = Util.getCurrentPath(filename);

            const data = fs.readFileSync(path, { encoding:'utf8', flag:'r' });
            const json = YAML.parse(data);
            console.log(json);

        }
        catch (err) {
            throw new Error('Fail to load');
        }
    }

}

module.exports = Loader;
