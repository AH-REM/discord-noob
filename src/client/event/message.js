'use_strict';

/**
 * @param {Message} message
 */
module.exports = message => {

    if (!message.guild) return;
    if (message.author.bot || message.webhookID) return;

    console.log(message.content);

};
