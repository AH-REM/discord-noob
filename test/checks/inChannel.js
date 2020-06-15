const Discord = require('discord.js');

exports.run = (options, eventEmitter) => {
    let channelId = channelConverter(options.channel, eventEmitter);
    if (!channelId) {
        console.error(`No channel with the ID/name ${options.role} could be found, this check will be disabled.`);
        return true;
    }

    if (eventEmitter instanceof Discord.Message) {
        return eventEmitter.channel.id === channelId;
    }
}

function channelConverter(channelResolvable, eventEmitter) {
    // Check if it's a channelID
    let channel = eventEmitter.guild.channels.cache.get(channelResolvable);
    // Check if it's a channel name
    if (!channel) {
        channel = eventEmitter.guild.channels.cache.find((channel) => channel.name === channelResolvable);
    }
    if (channel) {
        return channel.id;
    }
    return null;
}