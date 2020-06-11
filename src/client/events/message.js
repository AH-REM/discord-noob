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

    const Manager = client.managers['command'];

    /**
     * Get command
     */
    let Command;
    if (Manager.cache.commands.has(cmd)) {
        Command = Manager.cache.commands.get(cmd);
    } else if (Manager.cache.aliases.has(cmd)) {
        Command = Manager.cache.commands.get(Manager.cache.aliases.get(cmd));
    }
    else return;

    /**
     * If command is unique
     */
    if (Command.options.unique && args.length > 1) return;

    const response = Command.getMessage();
    if (response) {

        const channel = Command.getChannel(message);
        channel.send(response)
        .then(m => {
            Command.addReact(m);
        })
        .catch(console.error);

    }

    if (Command.options.delete > -1)
        message.delete({ timeout: Command.options.delete });

};