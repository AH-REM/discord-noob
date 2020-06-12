'use strict';

const Discord = require('discord.js');

const DefaultOptions = {
    message: {
        guild: null,
        channel: null,
        content: new Array(),
        react: new Array()
    },
    aliases: new Array(),
    delete: -1
};

exports.run = (options, message) => {

    options = Discord.Util.mergeDefault(DefaultOptions, options);

    const response = getMessage(options);
    if (response) {

        const channel = getChannel(options, message);
        channel.send(response)
            .then(m => {
                addReact(options, m);
            })
            .catch(console.error);

    }

    if (options.delete > -1)
        message.delete({timeout: options.delete});
};

exports.isAvailable = () => {
    return true;
};

function getMessage(options) {
    const rand = Math.floor(Math.random() * options.message.content.length);
    return options.message.content[rand];
}

function getChannel(options, message) {
    const { client } = message;
    const { guild, channel } = options.message;

    if (guild && channel) {
        const chan = client.guilds.cache.get(guild).channels.cache.get(channel);
        return chan;
    }
    else return message.channel;
}

function addReact(options, message) {
    const { react } = options.message;
    if (react.length < 1) return;
    for (let emoji of react) {
        // Gérer les erreurs
        message.react(emoji).catch(console.error);
    }
}
