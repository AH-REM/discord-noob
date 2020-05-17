'use_strict';

const { token } = require('./auth.js');
const Noob = require('../src');

const noob = new Noob.Client({
    token: token,
    prefix: '.'
});

// noob.loader('message', './messagetest');
