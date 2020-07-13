'use_strict';

(async function() {

    const fs = require('fs');

    const { token } = require('./auth.js');
    const Noob = require('../src');

    const noob = new Noob.Client({
        token: token,
        prefix: '!',
        activity: {
            name: 'des grenouilles.',
            type: 'WATCHING'
        },
        scripts: './scripts',
        checks: './checks',
        slugs: './slugs/'
    });

    // Add all slugs
    try {
        const folder = __dirname + '/slugs/';
        const files = fs.readdirSync(folder);
        for (const filename of files) {
            const name = filename.replace(/.js$/, '');
            noob.addSlug(name);
            console.log(`${name} is load`);
        }
    } catch (e) {
        console.log(e);
    }

    await noob.load('command', './cmdtest.yml');
    await noob.load('action', './actiontest.yml');

    noob.start();

})();
