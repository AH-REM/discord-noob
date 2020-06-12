'use_strict';

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = (client, message) => {

    if (!message.guild) return;
    if (message.author.bot || message.webhookID) return;

    const args = message.content.split(' ');
    const cmd = args[0];

    const manager = client.managers['command'];

    /**
     * Get command
     */
    let command;
    if (manager.cache.commands.has(cmd)) {
        command = manager.cache.commands.get(cmd);
    } else if (manager.cache.aliases.has(cmd)) {
        command = manager.cache.commands.get(manager.cache.aliases.get(cmd));
    }
    else return;

    /**
     * If command is unique
     */
    if (command.unique && args.length > 1) return;

    try {
        command.action(message, args);
    }
    catch (err) {
        console.log(err);
    }

};
