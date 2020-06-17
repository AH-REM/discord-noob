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

    /**
     * @param {Client} client
     * @param {Object} eventEmitter
     * @param {string} content
     * @return {string}
     */
    static parserMessage(client, eventEmitter, content) {

        let response = content;

        const arr = content.match(/[^{}]+(?=\})/g);
        if (arr) {

            for (let str of arr) {

                let [ name, arg ] = str.trim().split(':', 2);
                if (arg) arg = arg.trim();

                if (!client.slugs.cache.has(name)) continue;
                const slug = client.slugs.cache.get(name);

                const result = slug.exec(client, eventEmitter, arg);

                response = response.replace('{' + str + '}', result);

            }

        }

        return response;

    }

}

module.exports = Util;
