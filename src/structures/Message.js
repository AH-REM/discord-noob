'use strict';

class Message {

    constructor() { }

    /**
     * @param {Discord.Message} message
     * @return {Discord.TextChannel}
     */
    getChannel(message) {
        try {
            const { client } = message;
            const { guild, channel } = this.options.message;

            if (guild && channel) {
                const chan = client.guilds.cache.get(guild).channels.cache.get(channel);
                return chan;
            }
            else return message.channel;
        }
        catch (err) {
            // return err ?
            return message.channel;
        }
    }

    /**
     * return a random string in array
     * @return {string|null}
     */
    getMessage() {
        const rand = Math.floor(Math.random() * this.options.message.content.length);
        return this.options.message.content[rand];
    }

}

module.exports = Message;
