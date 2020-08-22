'use strict';

const Noob = require('../../');

const initMax = 10,
      initMin = 1;

module.exports = (client, eventEmitter, arg = initMax) => {

    this.client = client;
    this.eventEmitter = eventEmitter;

    let [ max, min ] = getNumbers(arg);

    if (!max) return;
    if (!min) min = initMin;

    return Math.floor(Math.random() * (max - min) + min);

}

/**
 * @return {int} || undefined
 */
const parseNumber = number => {
    if (isNaN(number)) return;
    return parseInt(number, 10);
}

/**
 * @return {Array} [ max, min ] || undefined
 */
const getNumbers = argument => {

    // It's a numberarg
    const number = parseNumber(argument);
    if (number) {
        return [ number ];
    }

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

    return;

}
