const Discord = require('discord.js');
//const { Converters, Extractors } = require('discord-noob');
const { Converters, Extractors } = require('../../index');

exports.run = async (options, eventEmitter, member, time,...reason) => {
    let guildMember;
    reason = reason.join(' ') || options.role || '';
    let guild = Extractors.guild(eventEmitter);
    if (!guild) {
        console.error(`Couldn't get a guild from the ${eventEmitter.event} event, is it supported?`);
        return null;
    }

    let muteRole = Converters.role(options.role || "Muted", eventEmitter) || await createMuteRole(guild, options.role);

    if (!muteRole) {
        console.error(`Couldn't find nor create the ${options.role || "Muted"} role.`);
        return;
    }

    if (eventEmitter.event === 'guildMemberUpdate') {
        guildMember = eventEmitter.eventArgs[1];
        let mutes = getMutes(eventEmitter.client.data, guild, guildMember.id);
        if (mutes.length && mutes[mutes.length - 1]._muted && !guildMember.roles.cache.has(muteRole.id)) {
            mutes[mutes.length - 1]._muted = false;
            setMutes(eventEmitter.client.data, guild, guildMember.id, mutes);
            console.log(`${guildMember.displayName} was unmuted from ${guild.name} sooner than expected.`)
        }
    } else if (eventEmitter.event === 'command') {
        guildMember = Converters.member(member, eventEmitter);
        if (!guildMember) {
            eventEmitter.eventArgs[0].react('❌').catch(console.error);
            console.error(`No member ${member} could be found.`);
            return;
        }
        guildMember.roles.add(muteRole, reason)
            .then(() => {
                eventEmitter.eventArgs[0].react('✅').catch(console.error);
                onceMuted(eventEmitter, guildMember, time, reason, muteRole.id);
            })
            .catch(e => {eventEmitter.eventArgs[0].react('❌').catch(console.error);
                console.error(`Couldn't mute the member ${guildMember.displayName}`)});

    } else {
        guildMember = Extractors.member(eventEmitter);
        if (!guildMember) {
            console.error(`Couldn't extract an user from the event ${eventEmitter.event}.`);
            return;
        }
        guildMember.roles.add(muteRole, reason)
            .then(m => onceMuted(eventEmitter, guildMember, options.time || '1d', reason, muteRole.id))
            .catch(e => console.error(`Couldn't mute ${guildMember.tag || guildMember.displayName}, who emitted the event ${eventEmitter.event}.`));
    }
}

exports.isAvailable = (options, client) => {
    if (client.tempData.unique.includes('mute')) return true;

    let counter = 0;
    let data = client.data.get('moderation') || {};
    for (let [guildId, users] of Object.entries(data)) {
        let guild = client.guilds.cache.get(guildId);
        if (!guild) continue;
        let muteRole = Converters.role(options.role || "Muted", {event: "guildCreate", eventArgs: [guild]});
        if (!muteRole) continue;
        for (let [userId, hist] of Object.entries(users)) {
            let mutes = hist.mutes || [];
            if (mutes.length && mutes[mutes.length - 1]._muted) {
                if (mutes[mutes.length - 1]._expire - Date.now > 1000 * 3600 * 24 * 10) continue;
                let expire = Math.max(0, mutes[mutes.length - 1]._expire - Date.now())
                setTimeout(timeoutFunc, expire, client.data, guild, userId, muteRole.id);
                counter += 1;
            }
        }
    }
    if (counter > 0) console.log(`The mute script has set up ${counter} timeouts.`);
    client.tempData.unique.push('mute');
    return true;
}

async function createMuteRole(guild, roleName = "Muted") {
    let muteRole = await guild.roles.create({ data: {
            name:roleName,
            color: "#000000",
            permissions:[]
        }});
    guild.channels.cache.forEach((channel, id) => {
        channel.createOverwrite(muteRole, {
            SEND_MESSAGES: false,
            MANAGE_MESSAGES: false,
            ADD_REACTIONS: false
        });
        console.log(channel.name)
    });

    return muteRole;
}

function getMutes(clientData, guild, userId) {
    let data = clientData.get('moderation') || {};
    data[guild.id] = data[guild.id] || {};
    let userData = data[guild.id][userId] || {};
    return userData.mutes || [];
}

function setMutes(clientData, guild, userId, mutes) {
    let data = clientData.get('moderation') || {};
    data[guild.id] = data[guild.id] || {};
    data[guild.id][userId] = data[guild.id][userId] || {};
    data[guild.id][userId].mutes = mutes;
    clientData.set('moderation', data);
}

function onceMuted(eventEmitter, guildMember, time, reason, roleId) {
    let mutes = getMutes(eventEmitter.client.data, guildMember.guild, guildMember.id);
    let expire = calcExpire(time);
    time = Converters.time(Converters.time(time, 'ms'), 'max');
    mutes.push({date: Date.now(), duration: time, _expire: expire, reason: reason, _muted: true});
    setMutes(eventEmitter.client.data, guildMember.guild, guildMember.id, mutes);

    setTimeout(timeoutFunc, expire - Date.now(), eventEmitter.client.data, guildMember.guild, guildMember.id, roleId);
    console.log(`${guildMember.tag || guildMember.displayName} will be unmuted in ${Converters.time(expire - Date.now(), 'max')}.`);
}

function calcExpire(time) {
    return Date.now() + Converters.time(time, 'ms');
}

function timeoutFunc(clientData, guild, userId, roleId) {
    let mutes = getMutes(clientData, guild, userId);
    if (mutes.length && !mutes[mutes.length - 1]._muted) return;
    mutes[mutes.length - 1]._muted = false;
    setMutes(clientData, guild, userId, mutes);

    guild.members.cache.get(userId).roles.remove(roleId, "Unmuted")
        .then(m => {
            console.log(`${m.displayName} was unmuted from ${guild.name}.`);
        })
        .catch(e => {
            console.log(`There was a problem unmuting the user with the id ${userId} from ${guild.name}.`);
        });
}