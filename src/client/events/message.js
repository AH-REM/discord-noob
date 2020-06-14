'use_strict';

const Group = require('../../structures/Group');

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = (client, message) => {

    if (!message.guild) return;
    if (message.author.bot || message.webhookID) return;

    const args = messageParse(message.content);
    const { prefix } = client.options;
    let commandFound = false;

    /**
     * Get command
     */
    if (args[0].startsWith(prefix)) {
        let noPrefixMessage = message.content.split('').slice(prefix.length).join('');
        commandFound = commandHandler(message, client, messageParse(noPrefixMessage), true);
    }

    if (!commandFound) {
        commandHandler(message, client, args);
    }

    /**
     * If command is unique, TODO: parsing scripts to know the needed arguments and use that instead
     */
    // if (command.options.unique && args.length > 0) return;

    // if (command.options.delete > -1)
    //     message.delete({timeout: command.options.delete});
    
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

/**
 * Loops in a commandHolder commands to find the one being called, used recursively for Groups.
 * @param {Discord.Message} message
 * @param {Client|Group} commandHolder
 * @param {string[]} pastArgs
 * @param {boolean} prefix
 *
 * @return {boolean} - If a command has been found
 */
function commandHandler(message, commandHolder, pastArgs = [], prefix = false) {
    const [name, ...args] = pastArgs;
    let command;

    if (commandHolder.managers['command'].cache.commands.has(name)) {
        command = commandHolder.managers['command'].cache.commands.get(name);
    } else if (commandHolder.managers['command'].cache.aliases.has(name)) {
        command = commandHolder.managers['command'].cache.aliases.get(name);
    } else if (commandHolder instanceof Group) {
        commandHolder.action(message, pastArgs);
        return true;
    } else {
        return false;
    }

    if (command.prefix === prefix && command.validateChecks(message, false)) {
        if (command instanceof Group) {
            return commandHandler(message, command, args);
        } else {
            command.action(message, args);
            return true;
        }
    }
    else {
        return false;
    }
}
