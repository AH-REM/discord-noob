'use strict';

class Slug {

    constructor(name, func) {
        this.name = name;
        this.func = func;
    }

    exec(arg, member) {
        try {
            const result = this.func(arg, member);
            return result;
        }
        catch (err) {
            return;
        }
    }

}

/*
const Slug = {

    'author': (arg, member) => {
        return member;
    },

    'rand': (arg) => {
        const nb = parseInt(arg + 1, 10);
        if (!isNaN(nb)) {
            return Math.floor(Math.random() * nb);
        }
    }

}
*/

module.exports = Slug;
