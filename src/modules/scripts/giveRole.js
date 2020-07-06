'use strict';
//let { Converters } = require('discord-noob');
let { Converters, Extractors } = require('../../index');

exports.run = (options, eventEmitter) => {
    let role = Converters.role(options.role, eventEmitter);
    if (!role) {
        console.error(`No role with the ID/name ${options.role} could be found, this role won't be given.`);
        return true;
    }

    let member = Extractors.member(eventEmitter);

    try {
        member.roles.add(role);
    } catch(e) {
        console.err(`Couldn't give the role ${role.name}`);
    }
};
