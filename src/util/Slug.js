'use strict';

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

module.exports = Slug;
