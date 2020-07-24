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
        eventEmitter.eventArgs[0].react('✅').catch(console.error);
    } else {
        guildMember = Extractors.member(eventEmitter);
    }

    let data = eventEmitter.client.data.get('moderation');
    data[guildMember.guild.id] = data[guildMember.guild.id] || {};
    let userData = data[guildMember.guild.id][guildMember.id] || {};
    userData.warnings = userData.warnings || [];
    userData.warnings.push({date: Date.now(), reason: reason || options.reason});
    data[guildMember.guild.id][guildMember.id] = userData;

    eventEmitter.client.data.set('moderation', data);
}