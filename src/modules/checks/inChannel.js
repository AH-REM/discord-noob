const Discord = require('discord.js');
//const { Converters, Extractors } = require('discord-noob');
const { Converters, Extractors } = require('../../index');

exports.run = (options, eventEmitter) => {
    let eventChannel = Extractors.channel(eventEmitter);

    if (!eventChannel) {
        console.error(`There was an error executing the inChannel check with the ${eventEmitter.event} event, is it supported?`);
        return true;
    }

    return inChannel(eventChannel, options.channel, eventEmitter);
}

function inChannel(eventChannel, channels, eventEmitter) {
    if (channels instanceof Array) {
        for (let channel of channels) {
            let Channel = Converters.channel(channel, eventEmitter);
            if (!Channel)
                console.error(`No channel with the ID/name ${channel} could be found.`)
            else if (eventChannel.id === Channel.id) return true;
        }
        return false;
    }
    let Channel = Converters.channel(channels, eventEmitter);
    if (!Channel) {
        console.error(`No channel with the ID/name ${channels} could be found.`);
        return false;
    }
    return eventChannel.id === Channel.id;
}