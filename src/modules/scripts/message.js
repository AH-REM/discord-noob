'use strict';

const Discord = require('discord.js');
// const Noob = require('discord-noob');
const Noob = require('../../index');

const DefaultOptions = {
    message: {
        raw: true,
        guild: null,
        channel: null,
        content: new Array(),
        react: new Array()
    },
    roles: new Array(),
    aliases: new Array(),
    delete: -1
};

exports.run = (options, message) => {

    options = Discord.Util.mergeDefault(DefaultOptions, options);

    addRole(options, message);

    let response = getMessage(options);
    if (response) {

        if (!options.raw) {
            response = Noob.parserMessage(message.client, message, response);
        }

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
    for (let emoji of options.message.react) {
        // Gérer les erreurs
        message.react(emoji).catch(console.error);
    }
}

function addRole(options, message) {
    const roles = new Array();
    for (let roleName of options.roles) {
        const role = message.guild.roles.cache.find(role => role.name === roleName);
        if (role) roles.push(role);
    }
    if (roles.length > 0)
        message.member.roles.add(roles);
}
