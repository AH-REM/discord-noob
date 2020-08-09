'use_strict';

(async function() {

    const { token } = require('./auth.js');

  //const Noob = require('discord-noob');
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
        slugs: './slugs/',
        data: './data'
    });

    await noob.load('command', 'cmdtest.yml');
    await noob.load('action', 'actiontest.yml');

    noob.start();

})();
