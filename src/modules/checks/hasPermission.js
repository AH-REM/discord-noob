//const { Extractors } = require('discord-noob');
const { Extractors } = require('../../index');
const { GuildMember } = require('discord.js');

exports.run = (options, eventEmitter) => {
    let author = Extractors.member(eventEmitter);

    if (!(author instanceof GuildMember)) {
        console.error(`There was an error executing the hasPermission check with the ${eventEmitter.event} event, is it supported?`);
        return true;
    }

    if (!(options.permission instanceof Array))
        options.permission = [options.permission];
    switch (options.mode) {
        case "any": {
            for (let perm in options.permission) {
                if (author.hasPermission(perm)) return true;
            }
            return false;
        }; break;
        default: {
            for (let perm in options.permission) {
                if (!author.hasPermission(perm)) return false;
            }
            return true;
        }
    }
};
