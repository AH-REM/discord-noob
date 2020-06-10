'use strict';

const req = action => require(`./${action}Manager`);

class Managers {

    constructor() {

        this.register(req('Command'));

    }

    register(Manager) {
        this[Manager.name.replace(/Manager$/, '').toLowerCase()] = Manager;
    }

}

module.exports = Managers;
