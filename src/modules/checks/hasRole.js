const Discord = require('discord.js');
//const { Converters, Extractors } = require('discord-noob');
const { Converters, Extractors } = require('../../index');

exports.run = (options, eventEmitter) => {
    let author = Extractors.member(eventEmitter);

    if (!(author instanceof Discord.GuildMember)) {
        console.error(`There was an error executing the hasRole check with the ${eventEmitter.event} event, is it supported?`);
        return true;
    }

    return hasRole(author, options.role, eventEmitter);
};

function hasRole(member, roles, eventEmitter) {
    if (roles instanceof Array) {
        for (let role of roles) {
            let Role = Converters.role(role, eventEmitter);
            if (!Role)
                console.error(`No role with the ID/name ${role} could be found.`)
            else if (member.roles.cache.has(Role.id)) return true;
        }
        return false;
    }
    let Role = Converters.role(roles, eventEmitter);
    if (!Role) {
        console.error(`No role with the ID/name ${roles} could be found.`);
        return false;
    }
    return member.roles.cache.has(Role.id);
}
