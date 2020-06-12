'use strict';

const Discord = require('discord.js');

const options = {
    message: {
        guild: null,
        channel: null,
        content: new Array(),
        react: new Array()
    },
    aliases: new Array(),
    delete: -1
};

exports.run = (command, message) => {

    command.options = Discord.Util.mergeDefault(options, command.options);

    const response = getMessage(command);
    if (response) {

        const channel = getChannel(command, message);
        channel.send(response)
            .then(m => {
                addReact(command, m);
            })
            .catch(console.error);

    }

    if (command.options.delete > -1)
        message.delete({timeout: command.options.delete});
};

exports.isAvailable = () => {
    return true;
};

function getMessage(command) {
    const rand = Math.floor(Math.random() * command.options.message.content.length);
    return command.options.message.content[rand];
}

function getChannel(command, message) {
    const { client } = message;
    const { guild, channel } = command.options.message;

    if (guild && channel) {
        const chan = client.guilds.cache.get(guild).channels.cache.get(channel);
        return chan;
    }
    else return message.channel;
}

function addReact(command, message) {
    const { react } = command.options.message;
    if (react.length < 1) return;
    for (let emoji of react) {
        // Gérer les erreurs
        message.react(emoji).catch(console.error);
    }
}
