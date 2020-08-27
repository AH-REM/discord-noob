'use strict';
//let { Converters } = require('discord-noob');
let { Converters, Extractors } = require('../../index');

exports.run = (options, eventEmitter) => {
    if (!['messageReactionAdd', 'messageReactionRemove'].includes(eventEmitter.event))
        return;

    let guild = Converters.guild(options.guild, eventEmitter);
    if (options.guild && !guild) {
        console.error(`No guild with the ID/name ${options.guild} could be found.`);
        return;
    }

    if (guild && Extractors.guild(eventEmitter).id !== guild.id) return;

    let role = Converters.role(options.role, eventEmitter);
    if (!role) {
        console.error(`No role with the ID/name ${options.role} could be found, this role won't be given/taken.`);
        return;
    }

    if (!eventEmitter.client.emojis.resolveIdentifier(options.reaction)) {
        console.error(`No emote with the name/unicode ${options.reaction} could be found`);
        return;
    }
    if (eventEmitter.eventArgs[0].emoji.name !== options.reaction || eventEmitter.eventArgs[0].message.id !== options.message)
        return;

    let member = Extractors.member(eventEmitter);

    switch (eventEmitter.event) {
        case 'messageReactionAdd': {
            try {
                member.roles.add(role);
            } catch(e) {
                console.err(`Couldn't give the role ${role.name}`);
            }
        } break;
        case 'messageReactionRemove': {
            try {
                member.roles.remove(role);
            } catch(e) {
                console.err(`Couldn't remove the role ${role.name}`);
            }
        } break;
    }
};

exports.isAvailable = (options, client) => {
    let channelHolder = Converters.guild(options.guild, {event: 'verification', client: client}) || client;
    for (let [ _, channel] of channelHolder.channels.cache) {
        if (channel.type === "text") {
            channel.messages.fetch(options.message).catch(e => '');
        }
    }
    return true;
}
