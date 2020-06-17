'use_strict';

const Util = require('./util/Util');
const Command = require('./structures/Command');
const Group = require('./structures/Group');
const Converters = require('./util/Converters');

module.exports = {

    Client: require('./client/Client'),

    Util: Util,

    Command: Command,

    Group: Group,

    Converters: Converters,

    parserMessage: Util.parserMessage,

};
