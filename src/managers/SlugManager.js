'use strict';

const Slug = require('../structures/Slug');

class SlugManager {

    constructor() {
        this.cache = new Map();
    }

    add(name, func) {
        const slug = new Slug(name, func);
        this.cache.set(name, slug);
    }

}

module.exports = SlugManager;
