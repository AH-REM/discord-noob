const Discord = require('discord.js');
//const { Converters, Extractors } = require('discord-noob');
const { Converters, Extractors } = require('../../index');

exports.run = (options, eventEmitter, member, ...reason) => {
    if (eventEmitter.event === 'command') {
        let guildMember = Converters.member(member, eventEmitter);
        if (!(guildMember instanceof Discord.GuildMember)) {
            eventEmitter.eventArgs[0].react('❌').catch(console.error);
            console.error(`No member ${member} could be found.`);
            return;
        }
        options.reason = reason.join(' ') || options.reason;
        guildMember.ban(options)
                    .then(() => eventEmitter.eventArgs[0].react('✅').catch(console.error))
                    .catch(e => {eventEmitter.eventArgs[0].react('❌').catch(console.error);
                                 console.error(`Couldn't ban the member ${guildMember.displayName}`)});
    } else {
        let guildMember = Extractors.member(eventEmitter);
        try {
            guildMember.ban(options).then(() => eventEmitter.eventArgs[0].react('✅').catch(console.error));
        } catch(e) {
            console.error(`Couldn't ban the member who emitted the event ${eventEmitter.event}`);
        }
    }
}