'use strict';

const Noob = require('../../');

const initMax = 10,
      initMin = 1;

/**
 * @example
 * // return random number
 * {rand}
 * @example
 * // Set max to number 100
 * {rand:100}
 * @example
 * // Set max the first argument of the message
 * {rand:{args:1}}
 * @example
 * // Use function set() to set max and min
 * {rand:set(100, {args:1})}
 */
module.exports = (client, eventEmitter, arg = initMax) => {

    this.client = client;
    this.eventEmitter = eventEmitter;

    let [ max, min ] = getNumbers(arg, true);

    if (!max) return;
    if (!min) min = initMin;

    return Math.floor(Math.random() * (max - min) + min);

}

/**
 * @return {int|undefined}
 */
const parseNumber = number => {
    if (isNaN(number)) return;
    return parseInt(number, 10);
}

/**
 * @param {string} argument
 * @param {boolean} onFunc - parse function is activate
 * @return {Array|undefined} [ max, min ]
 */
const getNumbers = (argument, onFunc) => {

    if (!argument) return;

    // It's a numberarg
    const number = parseNumber(argument);
    if (number) return [ number ];

    // It's a bracket
    const parse = Noob.parseBracket(argument);
    if (parse) {
        let [ name, arg ] = parse;

        if (name == 'args') {
            const res = require('./args')(this.client, this.eventEmitter, arg);
            return [ res ];
        }

        else return;
    }

    if (!onFunc) return;

    // It's a function
    const parse2 = Noob.parseFunction(argument);
    if (parse2) {
        let [ name, args ] = parse2;

        if (name == 'set') {
            let [ max, min ] = args;
            return [
                getNumbers(max),
                getNumbers(min)
            ]
        }

        else return;
    }

    return;

}
