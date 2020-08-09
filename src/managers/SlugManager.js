'use strict';

const fs = require('fs');
const path = require('path');
const Util = require('../util/Util');
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
            console.log('Loading slugs...');
            const defaultFolder = __dirname + '/../modules/slugs/';
            const files = fs.readdirSync(defaultFolder);
            for (const filename of files) {
                const name = filename.replace(/.js$/, '');
                this.add(name);
            }
            if (this.client.noobOptions.slugs) {
                const customFolder = Util.getCurrentPath(this.client.noobOptions.slugs);
                if (!fs.existsSync(customFolder)) return;
                const customFiles = fs.readdirSync(customFolder);
                for (const filename of customFiles) {
                    const name = filename.replace(/.js$/, '');
                    this.add(name);
                    console.log(`Custom slug ${name} loaded`);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

}

module.exports = SlugManager;
