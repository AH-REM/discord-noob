const Discord = require('discord.js');
//const { Converters } = require('discord-noob').Util;
const { Converters } = require('../../index').Util;

exports.run = (options, eventEmitter) => {
    let guild = Converters.guild(options.guild, eventEmitter);
    if (!guild) {
        console.error(`No guild with the ID/name ${options.role} could be found, this check will be disabled.`);
        return true;
    }

    if (eventEmitter instanceof Discord.Message) {
        return eventEmitter.guild.id === guild.id;
    }
}
