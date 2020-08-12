let Discord = require('discord.js');
let Exractors = require('./Extractors');

exports.role = (roleResolvable, eventEmitter) => {
    //It's already a Role
    if (roleResolvable instanceof Discord.Role) {
        return roleResolvable;
    }
    //It's a mention
    if (roleResolvable.match(Discord.MessageMentions.ROLES_PATTERN)) {
        roleResolvable = Discord.MessageMentions.ROLES_PATTERN.exec(roleResolvable)[1];
    }
    //It's an id or name
    let guild = Exractors.guild(eventEmitter);

    if (guild) {
        return guild.roles.cache.get(roleResolvable) ||
            guild.roles.cache.find((role) => role.name === roleResolvable) ||
            null;
    }
    return null;
}

exports.channel = (channelResolvable, eventEmitter) => {
    //It's already a Channel
    if (channelResolvable instanceof Discord.Channel) {
        return channelResolvable;
    }
    //It's a mention
    if (channelResolvable.match(Discord.MessageMentions.CHANNELS_PATTERN)) {
        channelResolvable = Discord.MessageMentions.CHANNELS_PATTERN.exec(channelResolvable)[1];
    }
    //It's an id or name
    return eventEmitter.client.channels.cache.get(channelResolvable) ||
        eventEmitter.client.channels.cache.find((channel) => channel.name === channelResolvable) ||
        null;
}

exports.guild = (guildResolvable, eventEmitter) => {
    //It's already a Guild
    if (guildResolvable instanceof Discord.Guild) {
        return guildResolvable;
    }
    //It's an id or name
    return eventEmitter.client.guilds.resolve(guildResolvable) ||
           eventEmitter.client.guilds.cache.find((guild) => guild.name === guildResolvable) ||
           null;
}

exports.member = (memberResolvable, eventEmitter) => {
    //It's already a Member
    if (memberResolvable instanceof Discord.GuildMember) {
        return memberResolvable;
    }
    //It's a mention
    if (memberResolvable.match(Discord.MessageMentions.USERS_PATTERN)) {
        memberResolvable = Discord.MessageMentions.USERS_PATTERN.exec(memberResolvable)[1];
    }
    //It's an id or name
    let guild = Extractors.guild(eventEmitter);

    if (guild) {
        return guild.members.cache.get(memberResolvable) ||
            guild.members.cache.find((member) => member.displayName === memberResolvable) ||
            guild.members.cache.find((member) => member.user.tag === memberResolvable) ||
            guild.members.cache.find((member) => member.user.username === memberResolvable) ||
            null;
    } else {
        return eventEmitter.client.users.cache.get(memberResolvable) ||
            eventEmitter.client.users.cache.find((user) => user.tag === memberResolvable) ||
            eventEmitter.client.users.cache.find((user) => user.username === memberResolvable) ||
            null;
    }
}

exports.time = (str, type) => {
    switch (type) {
        case "ms": {
            let timeSplit = str.split(" ");
            if (timeSplit.length === 2) {
                switch (timeSplit[1]) {
                    case 'milliseconds': return timeSplit[0];
                    case 'second':
                    case 'seconds': return timeSplit[0] * 1000;
                    case 'minute':
                    case 'minutes': return timeSplit[0] * 1000 * 60;
                    case 'hour':
                    case 'hours': return timeSplit[0] * 1000 * 3600;
                    case 'day':
                    case 'days': return timeSplit[0] * 1000 * 3600 * 24;
                }
            }
            let amount = parseInt(str);
            let multiplier = str.slice(amount.toString().length);
            switch (multiplier) {
                case '':
                case 'ms': return amount;
                case 's': return amount * 1000;
                case 'm': return amount * 1000 * 60;
                case 'h': return amount * 1000 * 3600;
                case 'd': return amount * 1000 * 3600 * 24;
            }
        } break;
        case 'max': {
            let time = parseInt(str);
            switch (true) {
                case (str >= 1000 * 3600 * 24): return `${Number((time/(1000 * 3600 * 24)).toFixed(2))} days`;
                case (str >= 1000 * 3600): return `${Number((time/(1000 * 3600)).toFixed(2))} hours`;
                case (str >= 1000 * 60): return `${Number((time/(1000 * 60)).toFixed(2))} minutes`;
                case (str >= 1000): return `${Number((time/1000).toFixed(2))} seconds`;
                default: return `${time} milliseconds`;
            }
        }
    }
}