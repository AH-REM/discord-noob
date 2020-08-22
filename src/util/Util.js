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
     * @param {string} str
     * @return {Array|undefined} [ name, [args] ]
     */
    static parseFunction(str = '') {

        // If the content does not have the ")" character at the end
        if (str.charAt(str.length - 1) !== ')') return;

        const indexOf = str.indexOf('(');
        if (!indexOf) return;

        let name = str.slice(0, indexOf);

        let args = str.slice(indexOf + 1, str.length - 1).split(',');
        args = args.map(a => a.trim());

        return [ name, args ];

    }

    /**
     * @param {string} content
     * @param {boolean} force
     * @return {Array|undefined} [ name, arg ]
     */
    static parseBracket(content = '', force) {

        // Test if content have bracket
        if (!force && (
            !content.startsWith('{') || content.charAt(content.length - 1) !== '}'
        )) return;

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
     * @param {string} str
     * @return {Array}
     */
    static getAllBracket(str) {

        const arr = new Array();
        let index, counter = 0, open = false;

        for (let i = 0; i < str.length; i++) {

            const char = str.charAt(i);

            if (char == '{') {
                counter++;
                if (!open) {
                    open = true;
                    index = i;
                }
            }

            else if (char == '}' && open) counter--;

            if (counter == 0 && open) {
                open = false;
                arr.push(str.slice(index, i + 1));
            }

        }

        return arr;

    }

    /**
     * @param {Client} client
     * @param {Object} eventEmitter
     * @param {string} content
     * @return {string}
     */
    static parserMessage(client, eventEmitter, content) {

        let response = content;

        for (let str of Util.getAllBracket(content)) {

            let [ name, arg ] = Util.parseBracket(str, true);

            if (!client.slugs.cache.has(name)) continue;
            const slug = client.slugs.cache.get(name);

            const result = slug.exec(client, eventEmitter, arg);

            response = response.replace(str, result);

        }

        return response;

    }

}

module.exports = Util;
