let Discord = require('discord.js');

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
    let guild;
    switch (eventEmitter.event) {
        case 'command':
        case 'message': guild = eventEmitter.eventArgs[0].guild; break;
        case 'messageReactionRemove':
        case 'messageReactionAdd': guild = eventEmitter.eventArgs[0].message.guild; break;
    }

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
    if (eventEmitter.guild) {
        return eventEmitter.guild.channels.cache.get(channelResolvable) ||
            eventEmitter.guild.channels.cache.find((channel) => channel.name === channelResolvable) ||
            null;
    } else if (eventEmitter.channels) {
        return eventEmitter.channels.cache.get(channelResolvable) ||
            eventEmitter.channels.cache.find((channel) => channel.name === channelResolvable) ||
            null;
    } else if (eventEmitter.client) {
        return eventEmitter.client.channels.cache.get(channelResolvable) ||
            eventEmitter.client.channels.cache.find((channel) => channel.name === channelResolvable) ||
            null;
    }
    return null;
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
    let guild;
    switch (eventEmitter.event) {
        case 'command':
        case 'message': guild = eventEmitter.eventArgs[0].guild; break;
        case 'messageReactionRemove':
        case 'messageReactionAdd': guild = eventEmitter.eventArgs[0].message.guild; break;
    }

    if (guild) {
        return guild.members.cache.get(memberResolvable) ||
            guild.members.cache.find((member) => member.displayName === memberResolvable) ||
            guild.members.cache.find((member) => member.user.tag === memberResolvable) ||
            guild.members.cache.find((member) => member.user.username === memberResolvable) ||
            null;
    } else if (eventEmitter.client.users) {
        return eventEmitter.client.users.cache.get(memberResolvable) ||
            eventEmitter.client.users.cache.find((user) => user.tag === memberResolvable) ||
            eventEmitter.client.users.cache.find((user) => user.username === memberResolvable) ||
            null;
    }
    return null;
}