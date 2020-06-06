'use_strict';

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = (client, message) => {

    if (!message.guild) return;
    if (message.author.bot || message.webhookID) return;

    const args = message.content.split(' ');
    const command = args[0];

    if (client.commands.has(command)) {
        const cmd = client.commands.get(command);

        if (cmd.options.unique && args.length > 1) return;

        const response = cmd.getMessage();
        if (response) {

            message.channel.send(response).then(m => {

                cmd.addReact(m);

            });

        }

        if (cmd.options.delete > -1) message.delete(cmd.options.delete);

    }

};
