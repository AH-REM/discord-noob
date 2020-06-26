const Discord = require('discord.js');
//const { Converters } = require('discord-noob');
const { Converters } = require('../../index');

exports.run = (options, eventEmitter) => {
    let guild = Converters.guild(options.guild, eventEmitter);
    if (!guild) {
        console.error(`No guild with the ID/name ${options.role} could be found, this check will be disabled.`);
        return true;
    }

    if (eventEmitter.event in ['command', 'message']) {
        return eventEmitter.eventArgs[0].guild.id === guild.id;
    }
}
