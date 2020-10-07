'use_strict';

(async function() {

    const { token } = require('./auth.js');

  //const Noob = require('discord-noob');
    const Noob = require('../src');

    const noob = new Noob.Client({
        token: token, // You can place directly your token here, if that's the case you can remove the first token line.
        prefix: '!',
        activity: {
            name: 'des grenouilles.',
            type: 'WATCHING'
        },
        scripts: './scripts',
        checks: './checks',
        slugs: './slugs',
        dataModel: 'yaml',
        dataSettings: {
            path: './data'
        }
    });

    await noob.load('command', 'cmdtest.yml');
    await noob.load('action', 'actiontest.yml');

    noob.start();

})();
