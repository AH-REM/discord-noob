'use_strict';

const Group = require('../../structures/Group');

/**
 * @param {Client} client
 * @param {Discord.Message} message
 */
module.exports = (client, message) => {

    if (!message.guild) return;
    if (message.author.bot || message.webhookID) return;

    const args = message.content.split(" ");
    const { prefix } = client.noobOptions;
    let commandFound = false;

    /**
     * Get command
     */
    if (args[0].startsWith(prefix)) {
        args[0] = args[0].substr(prefix.length);
        commandFound = commandHandler(message, client, args, true);
        args[0] = prefix + args[0];
    }

    if (!commandFound) {
        commandHandler(message, client, args);
    }

    /**
     * If command is unique, TODO: parsing scripts to know the needed arguments and use that instead
     */
    // if (command.options.unique && args.length > 0) return;
    
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
        let parsedArgs = messageParse(pastArgs.join(' '));
        if (commandHolder.options.definedArgCount && (parsedArgs.length < commandHolder.options.minArgs || parsedArgs.length > commandHolder.options.maxArgs)){
                if (commandHolder.options.argCountError)
                    message.channel.send(commandHolder.options.argCountError);
                return true;
        }
        let eventEmitter = {event: 'command', eventArgs: [message], arguments: [parsedArgs], client: message.client};
        commandHolder.action(eventEmitter, parsedArgs);
        if (commandHolder.options.delete > -1)
            message.delete({timeout: commandHolder.options.delete});
        return true;
    } else {
        return false;
    }

    if (command.available && command.prefix === prefix && command.validateChecks(message, false)) {
        if (command instanceof Group) {
            return commandHandler(message, command, args);
        } else {
            let parsedArgs = messageParse(args.join(' '));
            if (command.options.definedArgCount && (parsedArgs.length < command.options.minArgs || parsedArgs.length > command.options.maxArgs)){
                if (commandHolder.options.argCountError)
                    message.channel.send(commandHolder.options.argCountError);
                return true;
            }
            let eventEmitter = {event: 'command', eventArgs: [message], arguments: [parsedArgs], client: message.client};
            command.action(eventEmitter, parsedArgs);
            if (command.options.delete > -1)
                message.delete({timeout: command.options.delete});
            return true;
        }
    }
    else {
        return false;
    }
}
