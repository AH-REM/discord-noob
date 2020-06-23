'use strict';

module.exports = (client, eventEmitter, arg = 1) => {

    const nb = parseInt(arg, 10);
    if (!isNaN(nb)) {
        return Math.floor(Math.random() * (nb + 1));
    }

}
