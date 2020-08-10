const Discord = require('discord.js');
//const { Converters, Extractors } = require('discord-noob');
const { Converters, Extractors } = require('../../index');

exports.run = (options, eventEmitter, member, time, ...reason) => {
    let guildMember;
    reason = reason.join(' ');
    if (eventEmitter.event === 'guildBanRemove') {
        guildMember = Extractors.member(eventEmitter);
        let tempbans = getTempbans(eventEmitter.client.data, eventEmitter.eventArgs[0], guildMember.id);
        if (tempbans.length && tempbans[tempbans.length - 1]._banned) {
            tempbans[tempbans.length - 1]._banned = false;
            setTempbans(eventEmitter.client.data, eventEmitter.eventArgs[0], guildMember.id, tempbans);
            console.log(`${guildMember.tag} was unbanned from ${eventEmitter.eventArgs[0].name} sooner than expected.`)
        }
    } else if (eventEmitter.event === 'command') {
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
                onceBanned(eventEmitter, guildMember, time, options.reason, options);
            })
            .catch(e => {eventEmitter.eventArgs[0].react('❌').catch(console.error);
                console.error(`Couldn't tempban the member ${guildMember.displayName}`)});

    } else {
        guildMember = Extractors.member(eventEmitter);
        if (!guildMember) {
            console.error(`Couldn't extract an user from the event ${eventEmitter.event}.`);
            return;
        }
        guildMember.ban(options)
            .then(u => onceBanned(eventEmitter, guildMember, options.time || '1d', options.reason))
            .catch(e => console.error(`Couldn't tempban ${guildMember.tag || guildMember.displayName}, who emitted the event ${eventEmitter.event}.`));
    }
}

exports.isAvailable = (options, client) => {
    if (client.tempData.unique.includes('tempban')) return true;

    let counter = 0;
    let data = client.data.get('moderation') || {};
    for (let [guildId, users] of Object.entries(data)) {
        let guild = client.guilds.cache.get(guildId);
        if (!guild) continue;
        for (let [userId, hist] of Object.entries(users)) {
            let tempbans = hist.tempbans || [];
            if (tempbans.length && tempbans[hist.tempbans.length - 1]._banned) {
                if (tempbans[hist.tempbans.length - 1]._expire - Date.now > 1000 * 3600 * 24 * 10) continue;
                let _expire = Math.max(0, tempbans[hist.tempbans.length - 1]._expire - Date.now())
                setTimeout(timeoutFunc, _expire, client.data, guild, userId);
                counter += 1;
            }
        }
    }
    if (counter > 0) console.log(`The tempban script has set up ${counter} timeouts.`);
    client.tempData.unique.push('tempban');
    return true;
}

function getTempbans(clientData, guild, userId) {
    let data = clientData.get('moderation') || {};
    data[guild.id] = data[guild.id] || {};
    let userData = data[guild.id][userId] || {};
    return userData.tempbans || [];
}

function setTempbans(clientData, guild, userId, tempbans) {
    let data = clientData.get('moderation') || {};
    data[guild.id] = data[guild.id] || {};
    data[guild.id][userId] = data[guild.id][userId] || {};
    data[guild.id][userId].tempbans = tempbans;
    clientData.set('moderation', data);
}

function calcExpire(time) {
    return Date.now() + Converters.time(time, 'ms');
}

function timeoutFunc(clientData, guild, userId) {
    let tempbans = getTempbans(clientData, guild, userId);
    if (tempbans.length && !tempbans[tempbans.length - 1]._banned) return;
    tempbans[tempbans.length - 1]._banned = false;
    setTempbans(clientData, guild, userId, tempbans); //Updated before unbanning to prevent racing conditions with the "guildBanRemove" feature

    guild.members.unban(userId)
        .then(u => {
            console.log(`${u.tag} was unbanned from ${guild}`);
        })
        .catch(e => {
            console.log(`There was a problem unbanning the user with the id ${userId} from ${guild}`);
        });
}

function onceBanned(eventEmitter, guildMember, time, reason) {
    let tempbans = getTempbans(eventEmitter.client.data, guildMember.guild, guildMember.id);
    let expire = calcExpire(time);
    time = Converters.time(Converters.time(time, 'ms'), 'max');
    tempbans.push({date: Date.now(), duration: time, _expire: expire, reason: reason, _banned: true});
    setTempbans(eventEmitter.client.data, guildMember.guild, guildMember.id, tempbans);

    setTimeout(timeoutFunc, expire - Date.now(), eventEmitter.client.data, guildMember.guild, guildMember.id);
    console.log(`${guildMember.tag || guildMember.displayName} will be unbanned in ${Converters.time(expire - Date.now(), 'max')}.`);
}