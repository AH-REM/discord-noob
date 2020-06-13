'use strict';

const path = require('path');
const Slug = require('./Slug');

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
     * @param {Discord.Member} member
     * @return {string}
     */
    static parserMessage(content, member) {

        let response = content;

        const arr = content.match(/[^{}]+(?=\})/g);
        if (arr) {

            for (let str of arr) {

                let [ slug, arg ] = str.trim().split(':', 2);
                if (arg) arg = arg.trim();

                let result;
                const func = Slug[slug];
                if (func) result = func(arg, member);

                response = response.replace('{' + str + '}', result);

            }

        }

        return response;

    }

}

module.exports = Util;
