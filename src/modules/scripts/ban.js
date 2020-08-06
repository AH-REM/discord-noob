const Discord = require('discord.js');
//const { Converters, Extractors } = require('discord-noob');
const { Converters, Extractors } = require('../../index');

exports.run = (options, eventEmitter, member, ...reason) => {
    let guildMember;
    reason = reason.join(' ');
    if (eventEmitter.event === 'command') {
        guildMember = Converters.member(member, eventEmitter);
        if (!(guildMember instanceof Discord.GuildMember)) {
            eventEmitter.eventArgs[0].react('❌').catch(console.error);
            console.error(`No member ${member} could be found.`);
            return;
        }
        options.reason = reason || options.reason;
        guildMember.ban(options)
                    .then(() => {
                        eventEmitter.eventArgs[0].react('✅').catch(console.error);
                        onceBanned(eventEmitter, guildMember, options.reason);
                    })
                    .catch(e => {
                        eventEmitter.eventArgs[0].react('❌').catch(console.error);
                        console.error(`Couldn't ban the member ${guildMember.displayName}`)});
    } else {
        guildMember = Extractors.member(eventEmitter);
        if (!guildMember) {
            console.error(`Couldn't extract an user from the event ${eventEmitter.event}.`);
            return;
        }
        guildMember.ban(options)
            .then(u => onceBanned(eventEmitter, guildMember, options.reason))
            .catch(e => console.error(`Couldn't ban ${guildMember.tag || guildMember.displayName}, who emitted the event ${eventEmitter.event}.`));
    }
}

function onceBanned(eventEmitter, guildMember, reason) {
    let data = eventEmitter.client.data.get('moderation');
    data[guildMember.guild.id] = data[guildMember.guild.id] || {};
    let userData = data[guildMember.guild.id][guildMember.id] || {};
    userData.bans = userData.bans || [];
    userData.bans.push({date: Date.now(), reason: reason});
    data[guildMember.guild.id][guildMember.id] = userData;

    eventEmitter.client.data.set('moderation', data);
}