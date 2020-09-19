const Discord = require('discord.js');
//const { Converters, Extractors } = require('discord-noob');
const { Converters, Extractors } = require('../../index');

exports.run = (options, eventEmitter) => {
    let author = Extractors.member(eventEmitter);

    if (!(author instanceof Discord.GuildMember)) {
        console.error(`There was an error executing the hasRole check with the ${eventEmitter.event} event, is it supported?`);
        return true;
    }

    return hasRole(author, options.role, eventEmitter, options.mode);
};

function hasRole(member, roles, eventEmitter, mode) {
    if (!(roles instanceof Array))
        roles = [roles];
    switch (mode) {
        case "all": {
            for (let roleId of roles) {
                let role = Converters.role(roleId, eventEmitter);
                if (!role)
                    console.error(`No role with the ID/name ${role} could be found.`)
                else if (!member.roles.cache.has(role.id)) return false;
            }
            return true;
        }; break;
        default: {
            for (let roleId of roles) {
                let role = Converters.role(roleId, eventEmitter);
                if (!role)
                    console.error(`No role with the ID/name ${role} could be found.`)
                else if (member.roles.cache.has(role.id)) return true;
            }
            return false;
        }
    }
}
