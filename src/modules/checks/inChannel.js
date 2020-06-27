const Discord = require('discord.js');
//const { Converters } = require('discord-noob');
const { Converters } = require('../../index');

exports.run = (options, eventEmitter) => {
    let channel = Converters.channel(options.channel, eventEmitter);
    if (!channel) {
        console.error(`No channel with the ID/name ${options.role} could be found, this check will be disabled.`);
        return true;
    }

    if (['command', 'message'].includes(eventEmitter.event)) {
        return eventEmitter.eventArgs[0].channel.id === channel.id;
    }
}
