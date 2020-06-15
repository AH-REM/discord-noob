'use strict';

class Slug {

    constructor(name, func) {
        this.name = name;
        this.func = func;
    }

    exec(eventEmitter, arg) {
        try {
            const result = this.func(eventEmitter, arg);
            return result;
        }
        catch (err) {
            console.log(err);
            return;
        }
    }

}

module.exports = Slug;
