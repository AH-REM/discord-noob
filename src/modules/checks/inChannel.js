const Discord = require('discord.js');
//const { Converters } = require('discord-noob');
const { Converters } = require('../../index');

exports.run = (options, eventEmitter) => {
    let channel = Converters.channel(options.channel, eventEmitter);
    if (!channel) {
        console.error(`No channel with the ID/name ${options.role} could be found, this check will be disabled.`);
        return true;
    }

    if (eventEmitter instanceof Discord.Message) {
        return eventEmitter.channel.id === channel.id;
    }
}
