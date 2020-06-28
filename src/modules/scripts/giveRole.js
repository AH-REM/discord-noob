'use strict';
//let { Converters } = require('discord-noob');
let Converters = require('../../util/Converters');

exports.run = (options, eventEmitter) => {
    let role = Converters.role(options.role, eventEmitter);
    if (!role) {
        console.error(`No role with the ID/name ${options.role} could be found, this role won't be given.`);
        return true;
    }

    let member;
    switch (eventEmitter.event) {
        case 'message':
        case 'command': member = eventEmitter.eventArgs[0].member; break;
        case 'messageReactionAdd': member = Converters.member(eventEmitter.eventArgs[1].id, eventEmitter); break;
    }

    try {
        member.roles.add(role);
    } catch(e) {
        console.err(`Couldn't give the role ${role.name}`);
    }
};
