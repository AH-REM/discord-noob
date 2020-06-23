'use strict';

const ModuleManager = require('../managers/ModuleManager');

class Slug {

    constructor(client, name) {
        this.name = name;
        this.script = ModuleManager.load(client, 'slug', name);
    }

    exec(client, eventEmitter, arg) {
        try {
            const result = this.script(client, eventEmitter, arg);
            return result;
        }
        catch (err) {
            console.log(err);
            return;
        }
    }

}

module.exports = Slug;
