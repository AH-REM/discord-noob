'use strict';

const fs = require('fs');
const Util = require('../../util/Util');

class Loader {

    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    /**
     * @param {string} filename
     * @return - ?????
     */
    static load(filename) {
        try {

            const path = Util.getCurrentPath(filename);


        }
        catch (err) {
            throw new Error('Fail to load');
        }
    }

}

module.exports = Loader;
