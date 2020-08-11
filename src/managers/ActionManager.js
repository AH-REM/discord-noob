'use strict';

const Action = require('../structures/Action');

class ActionManager {

    constructor() {
        this.cache = new Map([['message',new Map()]]);
    }

    /**
     * @param {Client} client
     * @param {Object} json
     */
    load(client, json) {
        for (let [ name, values ] of Object.entries(json)) {
            const action = new Action(client, name, values);
            for (let event of ActionManager.event(values.event)) {
                if (!this.cache.has(event)) {
                    this.cache.set(event, new Map());
                }
                this.cache.get(event).set(name, action);
            }
        }
    }

    /**
     * Verifies if an event is actually a group of events.
     * @param name
     * @returns {string[]}
     */
    static event(name) {
        if (!(name instanceof Array)) {
            name = [name];
        }

        let groups = {
            channels: ['channelCreate', 'channelDelete', 'channelUpdate'],
            emojis: ['emojiCreate', 'emojiDelete', 'emojiUpdate'],
            bans: ['guildBanAdd', 'guildBanRemove'],
            guilds: ['guildCreate', 'guildDelete', 'guildUnavailable', 'guildUpdate'],
            guildMembers: ['guildMemberAdd', 'guildMemberRemove', 'guildMemberUpdate', 'presenceUpdate', 'userUpdate'],
            invites: ['inviteCreate', 'inviteDelete'],
            messages: ['message', 'messageDelete', 'messageUpdate'],
            voice: ['voiceStateUpdate', 'guildMemberSpeaking'],
            roles: ['roleCreate', 'roleRemove', 'roleUpdate'],
            reaction: ['messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji']
        }
        return name.flatMap(n => n in groups? groups[n]: n);
    }

    verifyAvailability() {
        this.cache.forEach((event) => event.forEach(action => action.isAvailable()));
    }
}

module.exports = ActionManager;
