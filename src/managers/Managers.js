'use strict';

const req = action => require(`./${action}Manager`);

class Managers {

    constructor() {

        this.register(req('Command'));
        this.register(req('Action'));

    }

    register(Manager) {
        this[Manager.name.replace(/Manager$/, '').toLowerCase()] = new Manager();
    }

}

module.exports = Managers;
