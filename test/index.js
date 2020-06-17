'use_strict';

(async function() {

    const path = require('path');
    const fs = require('fs')

    const { token } = require('./auth.js');
    const Noob = require('../src');

    const noob = new Noob.Client({
        token: token,
        prefix: '!',
        activity: {
            name: 'des grenouilles.',
            type: 'WATCHING'
        },
        scripts: './scripts/',
        checks: './checks/'
    });

    // Add all slugs
    try {
        const path = __dirname + '/slugs/';
        const files = fs.readdirSync(path);
        for (const filename of files) {
            const name = filename.replace(/.js$/, '');
            noob.addSlug(name, require(path + filename));
            console.log(`${name} is load`);
        }
    } catch (err) {
        console.log(err);
    }

    await noob.load('command', './cmdtest.yml');
    await noob.load('ready', './actiontest.yml');

    noob.start();

})();
