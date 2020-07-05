const Discord = require('discord.js');
//const { Converters, Extractors } = require('discord-noob');
const { Converters, Extractors } = require('../../index');

exports.run = (options, eventEmitter) => {
    let role = Converters.role(options.role, eventEmitter);
    if (!role) {
        console.error(`No role with the ID/name ${options.role} could be found, this check will be disabled.`);
        return true;
    }

    let author = Extractors.member(eventEmitter);

    if (!author || author instanceof Discord.User) {
        console.error(`There was an error executing the hasRole check with the ${eventEmitter.event} event, is it supported?`);
        return true;
    }

    return author.roles.cache.has(role.id);
};
