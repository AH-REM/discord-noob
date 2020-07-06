const Discord = require('discord.js');
//const { Converters, Extractors } = require('discord-noob');
const { Converters, Extractors } = require('../../index');

exports.run = (options, eventEmitter) => {
    let channel = Converters.channel(options.channel, eventEmitter);
    if (!channel) {
        console.error(`No channel with the ID/name ${options.role} could be found, this check will be disabled.`);
        return true;
    }

    let eventChannel = Extractors.channel(eventEmitter);

    if (!eventChannel) {
        console.error(`There was an error executing the inChannel check with the ${eventEmitter.event} event, is it supported?`);
        return true;
    }

    return channel.id === eventChannel.id;
}
