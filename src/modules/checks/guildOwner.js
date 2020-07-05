//const { Extractors } = require('discord-noob');
const { Extractors } = require('../../index');

exports.run = (options, eventEmitter) => {
    if (!eventEmitter.guild) {
        return false;
    }

    let guild = Extractors.guild(eventEmitter);

    let author = Extractors.member(eventEmitter);

    if (!guild || !author) {
        console.error(`There was an error executing the guildOwner check with the ${eventEmitter.event} event, is it supported?`);
        return true;
    }
    return guild.owner.id === author.id;
};
