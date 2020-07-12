'use_strict';

const Group = require('../../structures/Group');

/**
 * @param {Client} client
 * @param {Discord.Message} message
 */
module.exports = (client, message) => {

    // Normal "message" event
    let eventEmitter = {event: "message", eventArgs: [message], client: client};
    for (let [ _, action ] of client.managers['action'].cache.get("message")) {
        action.run(eventEmitter);
    }

    // Commands
    eventEmitter.event = "command";
    if (!message.guild) return;
    if (message.author.bot || message.webhookID) return;

    const args = message.content.split(" ");
    const { prefix } = client.noobOptions || '';
    if (!prefix) console.err('No prefix has been given.');

    let commandFound = false;

    // Check the Commands that need a prefix
    if (args[0].startsWith(prefix)) {
        args[0] = args[0].substr(prefix.length);
        commandFound = commandHandler(eventEmitter, client, args, true);
        args[0] = prefix + args[0];
    }
    // Check those that don't, if none with a prefix has been found
    if (!commandFound) {
        commandHandler(eventEmitter, client, args);
    }
    
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
            buffer += char === 'n' ? '\n' : char;
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
 * Loops in a commandHolder's commands to find the one being called, used recursively for Groups.
 * @param eventEmitter
 * @param {Client|Group} commandHolder
 * @param {string[]} pastArgs
 * @param {boolean} prefix
 *
 * @return {boolean} - If a command has been found
 */
function commandHandler(eventEmitter, commandHolder, pastArgs, prefix = false) {
    let message = eventEmitter.eventArgs[0];
    let groupFailed = false;
    let [name, ...args] = pastArgs;
    let command = commandHolder.managers['command'].cache.commands.get(name) ||
                  commandHolder.managers['command'].cache.aliases.get(name);

    if (!command && commandHolder instanceof Group) {
        groupFailed = true;
        args = pastArgs;
        command = commandHolder;
    } else if (!command)
        return false;

    if (groupFailed || (command.available && command.prefix === prefix && command.validateChecks(message, false))) {
        if (command instanceof Group && !groupFailed) {
            return commandHandler(eventEmitter, command, args);
        } else {
            let parsedArgs = messageParse(args.join(' '));

            if (command.options.definedArgCount && (parsedArgs.length < command.options.minArgs || parsedArgs.length > command.options.maxArgs)){
                if (command.options.argCountError)
                    message.channel.send(command.options.argCountError);
                return true;
            }
            command.action(eventEmitter, parsedArgs);
            if (command.values.delete > -1)
                message.delete({timeout: command.values.delete});

            return true;
        }
    }
    else
        return false;
}
