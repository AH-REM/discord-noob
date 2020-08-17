'use strict';

module.exports = (client, eventEmitter, arg = new String()) => {

    const arr = arg.split('|');
    const rand = Math.floor(Math.random() * arr.length);
    return arr[rand] || '';

}
