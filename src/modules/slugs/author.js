'use strict';

const Discord = require('discord.js');
const { Extractors } = require('../../index');

module.exports = (client, eventEmitter, arg) => {

    return Extractors.member(eventEmitter) ? Extractors.member(eventEmitter).toString() : 'ERROR';

}
