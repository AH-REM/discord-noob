'use_strict';

const path = require('path');

const { token } = require('./auth.js');
const Noob = require('../src');

const noob = new Noob.Client({
    token: token,
    prefix: '!',
    activity: {
        name: 'des grenouilles.',
        type: 'WATCHING'
    }
});

// noob.load(path.join(__dirname, 'cmdtest.yml'));

noob.start();
