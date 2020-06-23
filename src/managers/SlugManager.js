'use strict';

const fs = require('fs');
const Slug = require('../structures/Slug');

class SlugManager {

    constructor(client) {
        this.client = client;
        this.cache = new Map();
        this._load();
    }

    add(name) {
        if (!this.cache.has(name)) {
            const slug = new Slug(this.client, name);
            this.cache.set(name, slug);
        }
    }

    _load() {
        try {
            const folder = __dirname + '/../modules/slugs/';
            const files = fs.readdirSync(folder);
            for (const filename of files) {
                const name = filename.replace(/.js$/, '');
                this.add(name);
            }
        } catch (e) {
            console.log(e);
        }
    }

}

module.exports = SlugManager;
