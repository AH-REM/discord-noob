'use_strict';

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = (client, message) => {

    if (!message.guild) return;
    if (message.author.bot || message.webhookID) return;

    const args = messageParse(message.content);
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
    if (command.options.unique && args.length > 1) return;

    const response = command.getMessage();
    if (response) {

        const channel = command.getChannel(message);
        channel.send(response)
        .then(m => {
            command.addReact(m);
        })
        .catch(console.error);

    }

    if (command.options.delete > -1)
        message.delete({ timeout: command.options.delete });

};

/**
 *  A more powerful message parsing, allows escaping characters (\) and quotes ("").
 * @param {string} content
 * @return {string[]} args
 */
function messageParse(content) {
    let args = [];
    let buffer = "";
    let inQuote = false;
    let escaped = false;
    let ready = false;
    for (let char of content) {
        if (escaped) {
            buffer += char;
            escaped = false;
        }
        else if (char === '"') {
            if (inQuote) {
                ready = true;
                inQuote = false;
            }
            else {
                inQuote = true;
            }
        }
        else if (char === ' ' && !inQuote) {
            ready = true;
        }
        else if (char === "\\") {
            escaped = true;
        }
        else {
            buffer += char;
        }
        if (ready && buffer) {
            args.push(buffer);
        }
        if (ready) {
            ready = false;
            buffer = "";
        }
    }
    if (buffer) {
        args.push(buffer);
    }
    return args;
}
