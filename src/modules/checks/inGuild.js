const Discord = require('discord.js');
//const { Converters, Extractors } = require('discord-noob');
const { Converters, Extractors } = require('../../index');

exports.run = (options, eventEmitter) => {
    let guild = Converters.guild(options.guild, eventEmitter);

    if (!guild) {
        console.error(`No guild with the ID/name ${options.role} could be found, this check will be disabled.`);
        return true;
    }

    let eventGuild = Extractors.guild(eventEmitter);

    if (!eventGuild) {
        console.error(`There was an error executing the inGuild check with the ${eventEmitter.event} event, is it supported?`);
        return true;
    }

    return inGuild(eventGuild, options.guild, eventEmitter);
};

function inGuild(eventGuild, guilds, eventEmitter) {
    if (guilds instanceof Array) {
        for (let guild of guilds) {
            let Guild = Converters.guild(guild, eventEmitter);
            if (!Guild)
                console.error(`No guild with the ID/name ${guild} could be found.`)
            else if (eventGuild.id === Guild.id) return true;
        }
        return false;
    }
    let Guild = Converters.guild(guilds, eventEmitter);
    if (!Guild) {
        console.error(`No guild with the ID/name ${guilds} could be found.`);
        return false;
    }
    return eventGuild.id === Guild.id;
}