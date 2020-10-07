const Discord = require('discord.js');
//const { Converters, Extractors } = require('discord-noob');
const { Converters, Extractors } = require('../../index');

exports.run = (options, eventEmitter, member = "") => {
    let guildMember = member ? Converters.member(member, eventEmitter): Extractors.member(eventEmitter);
    if (!(guildMember instanceof Discord.GuildMember)) {
        eventEmitter.eventArgs[0].react('❌').catch(console.error);
        console.error(`No member ${member} could be found.`);
        return;
    }

    let userData = eventEmitter.client.data.get('moderation', {guild: guildMember.guild.id, user: guildMember.id});

    let embed = new Discord.MessageEmbed()
        .setAuthor(guildMember.user.username, guildMember.user.avatarURL())
        .setColor(options.color || 0);

    for (let key of options.enabled) {
        key = key.toLowerCase();
        const title = capitalize(key);
        let content = [];
        let modEntry = userData.find(e => e.type === key)? userData.find(e => e.type === key).content : [];
        if (!modEntry || !modEntry.length) {
            content = 'None.';
        } else {
            for (let modCase of modEntry) {
            let modCaseContent = [];
            for (let [ type, value ] of Object.entries(modCase)) {
                if (type[0] === '_') continue;
                modCaseContent.unshift(parse(type, value));
            }
            content.push(modCaseContent);
            }
            content = content.map(arr => arr.join("\n")).join(options.separator || "\n━━━━━━━━━━━━━━━━━━━━\n");
        }
        embed.addField(title, content);
    }
    eventEmitter.eventArgs[0].channel.send(embed);
}

function capitalize(str) {
    if (str.length) {
        return str[0].toUpperCase() + str.slice(1);
    }
    return str;
}

function parse(type, value) {
    switch (type) {
        case "expire":
        case "date": value = new Date(value).toLocaleString("en-GB", {dateStyle:'medium', timeStyle:'long'}); break;
    }
    return `**${capitalize(type)}:** ${value}`;
}