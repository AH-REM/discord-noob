const Discord = require('discord.js');

exports.run = (options, eventEmitter) => {
    if (!eventEmitter.guild) {
        return false;
    }

    let ownerId = eventEmitter.guild.owner.id;

    if (eventEmitter instanceof Discord.Message) {
        return eventEmitter.member.id === ownerId;
    }
}