const Discord = require('discord.js');

exports.run = (options, eventEmitter) => {
    let roleId = roleConverter(options.role, eventEmitter);
    if (!roleId) {
        console.error(`No role with the ID/name ${options.role} could be found, this check will be disabled.`);
        return true;
    }

    if (eventEmitter instanceof Discord.Message) {
        return eventEmitter.member.roles.cache.has(roleId);
    }
}

function roleConverter(roleResolvable, eventEmitter) {
    // Check if it's a roleID
    let role = eventEmitter.guild.roles.cache.get(roleResolvable);
    // Check if it's a role name
    if (!role) {
        role = eventEmitter.guild.roles.cache.find((role) => role.name === roleResolvable);
    }
    if (role) {
        return role.id;
    }
    return null;
}