'use strict';

const Discord = require('discord.js');
const { Extractors } = require('../../index');

module.exports = (client, eventEmitter, arg) => {

    let user = Extractors.member(eventEmitter);
    if (!user) return 'ERROR';

    switch (arg) {
        case 'name' : return user.displayName || user.username;
        case 'tag' : return user.tag || user.user.tag;
        case 'id' : return user.id;
        case 'mention' :
        default : return user.toString();
    }

}
