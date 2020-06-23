'use_strict';

const Util = require('./util/Util');
const Command = require('./structures/Command');
const Group = require('./structures/Group');
const Converters = require('./util/Converters');

module.exports = {

    Client: require('./client/Client'),

    Util: Util,

    Converters: Converters,

    Command: Command,

    Group: Group,

    parserMessage: Util.parserMessage,

};
