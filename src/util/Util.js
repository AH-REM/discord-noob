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
     * @param {string} content
     * @return {Array} [ name, arg ]
     */
    static parseBracket(content) {

        // Remove "{...}"
        content = content.slice(1, content.length - 1);

        const parse = content.trim().split(':');

        // first element before ':'
        let name = parse[0];

        // all element after ':'
        let arg = parse.slice(1).join(':');
        if (arg) arg = arg.trim();

        return [ name, arg ];

    }

    /**
     * @param {Client} client
     * @param {Object} eventEmitter
     * @param {string} content
     * @return {string}
     */
    static parserMessage(client, eventEmitter, content) {

        let response = content;

        const arr = content.match(/{([\w\s|(\w\s:(\{\w\s:\w\s\})]*)}/g);

        if (arr) {

            for (let str of arr) {

                let [ name, arg ] = Util.parseBracket(str);

                if (!client.slugs.cache.has(name)) continue;
                const slug = client.slugs.cache.get(name);

                const result = slug.exec(client, eventEmitter, arg);

                response = response.replace(str, result);

            }

        }

        return response;

    }

}

module.exports = Util;
