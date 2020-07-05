let Discord = require('discord.js');

exports.guild = (eventEmitter) => {
    switch (eventEmitter.event) {
        case "channelCreate":
        case "channelDelete":
        case "channelPinsUpdate":
        case "channelUpdate":
        case "webhookUpdate":

        case "emojiCreate":
        case "emojiDelete":
        case "emojiUpdate":

        case "command":
        case "message":
        case "messageDelete":
        case "messageUpdate":

        case "messageReactionRemoveAll":

        case "guildMemberAdd":
        case "guildMemberRemove":
        case "guildMemberUpdate":
        case "guildMemberSpeaking":

        case "presenceUpdate":

        case "roleCreate":
        case "roleDelete":
        case "roleUpdate":

        case "typingStart":
        case "voiceStateUpdate":

        case "inviteCreate":
        case "inviteDelete": return eventEmitter.eventArgs[0].guild;

        case "messageReactionAdd":
        case "messageReactionRemove":
        case "messageReactionRemoveEmoji": return eventEmitter.eventArgs[0].message.guild;

        case "guildCreate":
        case "guildDelete":
        case "guildUpdate":
        case "guildIntegrationsUpdate":
        case "guildUnavailable":

        case "guildBanAdd":
        case "guildBanRemove": return eventEmitter.eventArgs[0];

        case "guildMembersChunk": return eventEmitter.eventArgs[1];

        case "messageDeleteBulk": return eventEmitter.eventArgs[0].first().guild;
        default : return null;
    }
};

exports.member = (eventEmitter) => {
    let member;
    switch (eventEmitter.event) {
        case "presenceUpdate":

        case "voiceStateUpdate":

        case "command":
        case "message":
        case "messageDelete":
        case "messageUpdate": member = eventEmitter.eventArgs[0].member || eventEmitter.eventArgs[0].author; break;

        case "guildMemberAdd":
        case "guildMemberRemove":
        case "guildMemberUpdate":
        case "guildMemberSpeaking": member = eventEmitter.eventArgs[0]; break;

        case "inviteCreate":
        case "inviteDelete": member = eventEmitter.eventArgs[0].inviter; break;

        case "guildBanAdd":
        case "guildBanRemove":

        case "messageReactionAdd":
        case "messageReactionRemove":

        case "typingStart": member = eventEmitter.eventArgs[1]; break;
        default : return null;
    }

    if (member instanceof Discord.User) {
        let guild = exports.guild(eventEmitter);
        if (guild)
            member = guild.members.cache.get(member.id) || member;
    }
    return member;
};

exports.user = (eventEmitter) => {
    if (!exports.member(eventEmitter)) return null;
    return exports.member(eventEmitter).user || exports.member(eventEmitter);
};
