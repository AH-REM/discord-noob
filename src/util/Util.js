'use strict';

const path = require('path');

class Util {

    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    /**
     * @param {string} filename
     * @return {string}
     */
    static getCurrentPath(filename) {
        const dirname = path.dirname(process.pkg ? process.execPath : (require.main ? require.main.filename : process.argv[0]));
        return path.join(dirname, filename);
    }

}

module.exports = Util;
