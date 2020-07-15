//const { Converters } = require('discord-noob');
const { Converters } = require('../../index');
const Discord = require('discord.js');

exports.run = (options, eventEmitter) => {
    let title;
    switch (eventEmitter.event) {
        case "message": title = "Message sent"; break;
        case "messageUpdate": title = "Message edited"; break;
        case "messageDelete": title = "Message deleted"; break;
        default: console.error('The logMessage script only accepts message events.'); return;
    }
    let message = eventEmitter.eventArgs[0];
    if (message.author.bot) return;
    title = `**${title} by ${message.author} in ${message.channel}**`

    let embed = new Discord.MessageEmbed()
        .setDescription(options.title || title)
        .setAuthor(message.author.username, message.author.avatarURL())
        .setColor(options.color || 0);

    switch (eventEmitter.event) {
        case "message":
        case "messageDelete":
            embed.addField('Content', message.content); break;
        case "messageUpdate":
            embed.addField('Before', message.content);
            embed.addField('After', eventEmitter.eventArgs[1].content);
    }

    let channel = Converters.channel(options.channel, eventEmitter)
    if (!channel) {
        console.error(`No role with the ID/name ${options.channel} could be found, this script won't work properly.`);
        return;
    }
    channel.send(embed);
}