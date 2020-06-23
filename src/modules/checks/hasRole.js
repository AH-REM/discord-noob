const Discord = require('discord.js');
//const { Converters } = require('discord-noob');
const { Converters } = require('../../index');

exports.run = (options, eventEmitter) => {
    let role = Converters.role(options.role, eventEmitter);
    if (!role) {
        console.error(`No role with the ID/name ${options.role} could be found, this check will be disabled.`);
        return true;
    }

    if (eventEmitter instanceof Discord.Message) {
        return eventEmitter.member.roles.cache.has(role.id);
    }
}
