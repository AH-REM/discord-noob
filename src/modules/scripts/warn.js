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

    let data = eventEmitter.client.data;
    let query = data.get('moderation', {guild: guildMember.guild.id, user: guildMember.id, type: 'warnings'});

    let warnings = query.length ? query[0].content : data.default('moderation');

    warnings.push({date: Date.now(), reason: reason || options.reason});
    data.set('moderation', {guild: guildMember.guild.id, user: guildMember.id, type: 'warnings'}, warnings);

}