'use_strict';

const Util = require('./util/Util');
const Command = require('./structures/Command');
const Group = require('./structures/Group');

module.exports = {

    Client: require('./client/Client'),

    Util: Util,

    Command: Command,

    Group: Group,

    parserMessage: Util.parserMessage,

};
