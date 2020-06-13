'use strict';

const Command = require('./Command');
const CommandManager = require('../managers/CommandManager');

class Group extends Command {
    constructor(client, prefix, name, values = {}) {
        super(client, prefix, name, values);

        this.manager = new CommandManager(false);
        this.manager.load(client, values.commands);
    }
}

module.exports = Group;
