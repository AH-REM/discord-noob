'use_strict';

const path = require('path');

const { token } = require('./auth.js');
const Noob = require('../src');

const noob = new Noob.Client({
    token: token,
    prefix: '.'
});

noob.load(path.join(__dirname, 'cmdtest'));
