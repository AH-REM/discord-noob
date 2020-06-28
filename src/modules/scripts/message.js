'use strict';

const Discord = require('discord.js');
// const Noob = require('discord-noob');
const Noob = require('../../index');

const DefaultOptions = {
    raw: true,
    guild: null,
    channel: null,
    content: new Array(),
    react: new Array()
};

exports.run = (options, eventEmitter) => {

    options = Discord.Util.mergeDefault(DefaultOptions, options);

    //addRole(options, eventEmitter);

    let response = getMessage(options);
    if (response) {

        if (!options.raw) {
            response = Noob.parserMessage(eventEmitter.client, eventEmitter, response);
        }

        const channel = getChannel(options, eventEmitter.eventArgs[0]);
        channel.send(response)
            .then(m => {
                addReact(options, m);
            })
            .catch(console.error);

    }
};

exports.isAvailable = () => {
    return true;
};

function getMessage(options) {
    const rand = Math.floor(Math.random() * options.content.length);
    return options.content[rand];
}

function getChannel(options, message) {
    const { client } = message;
    const { guild, channel } = options;

    if (guild && channel) {
        const chan = client.guilds.cache.get(guild).channels.cache.get(channel);
        return chan;
    }
    else return message.channel;
}

function addReact(options, message) {
    for (let emoji of options.react) {
        // Gérer les erreurs
        message.react(emoji).catch(console.error);
    }
}

function addRole(options, eventEmitter) {
    let message = eventEmitter.eventArgs[0];
    const roles = new Array();
    for (let roleName of options.roles) {
        const role = message.guild.roles.cache.find(role => role.name === roleName);
        if (role) roles.push(role);
    }
    if (roles.length > 0)
        message.member.roles.add(roles);
}
