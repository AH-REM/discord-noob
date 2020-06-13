'use_strict';

const Group = require('../../structures/Group');

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = (client, message) => {

    if (!message.guild) return;
    if (message.author.bot || message.webhookID) return;

    const [command] = messageParse(message.content);
    const { prefix } = client.options;
    let commandFound = false;

    const manager = client.managers['command'];

    /**
     * Get command
     */
    if (command.startsWith(prefix)) {
        let noPrefix = message.content.split('').slice(prefix.length).join('');
        commandFound = commandHandler(message, noPrefix, manager.cache, [], true);
    }

    if (!commandFound) {
        commandHandler(message, message.content, manager.cache, []);
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
 * @param {string} content
 * @param {Client|Group} commandHolder
 * @param {string[]} pastArgs
 * @param {boolean} prefix
 *
 * @return {boolean} - If a command has been found
 */
function commandHandler(message, content, commandHolder, pastArgs = [], prefix = false) {
    const [name, ...args] = messageParse(content);
    let rawArgs = args.join(" ");
    let command;

    if (commandHolder.commands.has(name)) {
        command = commandHolder.commands.get(name);
    } else if (commandHolder.aliases.has(name)) {
        command = commandHolder.aliases.get(name);
    } else if (commandHolder instanceof Group) {
        commandHolder.action(message, pastArgs);
        return true;
    } else {
        return false;
    }

    if (command.prefix === prefix) {
        if (command instanceof Group) {
            return commandHandler(message, rawArgs, command.manager.cache, args);
        } else {
            command.action(message, args);
            return true;
        }
    }
    else {
        return false;
    }
}
