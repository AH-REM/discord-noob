const Discord = require('discord.js');

exports.run = (options, eventEmitter) => {
    let guildId = guildConverter(options.guild, eventEmitter);
    if (!guildId) {
        console.error(`No guild with the ID/name ${options.role} could be found, this check will be disabled.`);
        return true;
    }

    if (eventEmitter instanceof Discord.Message) {
        return eventEmitter.guild.id === guildId;
    }
}

function guildConverter(guildResolvable, eventEmitter) {
    // Check if it's a guildID
    let guild = eventEmitter.client.guilds.cache.get(guildResolvable);
    // Check if it's a guild name
    if (!guild) {
        guild = eventEmitter.client.guilds.cache.find((guild) => guild.name === guildResolvable);
    }
    if (guild) {
        return guild.id;
    }
    return null;
}