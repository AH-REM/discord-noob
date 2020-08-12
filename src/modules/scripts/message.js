'use strict';

const Discord = require('discord.js');
// const Noob = require('discord-noob');
const Noob = require('../../index');

const DefaultOptions = {
    raw: true,
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

        const channel = getChannel(options, eventEmitter);
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
    if (options.content instanceof Array) {
        const rand = Math.floor(Math.random() * options.content.length);
        return options.content[rand];
    }
    return options.content;
}

function getChannel(options, eventEmitter) {
    return Noob.Converters.channel(options.channel, eventEmitter) || Noob.Extractors.channel(eventEmitter);
}

function addReact(options, message) {
    if (!options.react) return;
    if (!(options.react instanceof Array)) options.react = [options.react];
    options.react
        .map(r => message.client.emojis.resolveIdentifier(r))
        .forEach(r => {if (r) message.react(r).catch(console.error)});
}
