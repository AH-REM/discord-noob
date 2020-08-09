// const Noob = require('discord-noob');
const Noob = require('../../index');
const Discord = require('discord.js');

exports.run = function(options, eventEmitter) {
    let message = eventEmitter.eventArgs[0];
    let bot = eventEmitter.client;
    let prefix = bot.noobOptions.prefix;
    let args = eventEmitter.arguments;
    // Settings
    let title = options.title || "Commands";
    let description = options.description || `**Prefix:** ${prefix}`;
    let color = options.color || 0;
    let thumbnailUrl = options.thumbnailUrl || bot.user.avatarURL();
    let maxLength = options.maxLength || 60;
    let maxCommands = 10;

    let embed = new Discord.MessageEmbed({ "title": title, "description": description, "color": color});

    // Loop in the command holders to go as deep as possible.
    let fields = [];
    let commandHolder = bot;
    let target;
    let counter = 0;
    let goOn = true;
    while (counter < args.length && goOn) {
        goOn = false;
        let command = commandHolder.managers['command'].cache.commands.get(args[counter]) || commandHolder.managers['command'].cache.aliases.get(args[counter]);
        if (command && command.validateChecks(message, true)) {
            if (command instanceof Noob.Group) {
                commandHolder = command;
                goOn = true;
            } else if (!command.values.hidden){
                target = command;
            }
        }
        counter++;
    }
    target = target || commandHolder;

    if ((target instanceof Noob.Command) && !(target instanceof Noob.Group)) {
        let usage = target.values.usage || Noob.Command.usageParser(target);
        usage = usage ? `*${usage}*` : "";
        let field = { "name": `**${target.name} ${usage} **`, "value": `${target.values.description || 'No description'}` };
        fields.push(field);
        if (target.aliases.length) {
            field = { "name": `**Aliases**`, "value": "- " + target.aliases.join("\n- ") };
            fields.push(field);
        }
    }
    else {
        if (target instanceof Noob.Group) {
            embed.setTitle(target.name);
            embed.setDescription(target.values.description || '');
        }
        target.managers['command'].cache.commands.forEach((cmd) => {
                let field = { "name": `**${cmd.name}**`, "value": `${truncateStr(cmd.values.description || 'No description', maxLength)}` };
                if (cmd.values.hidden || (commandHolder instanceof Noob.Client && !cmd.prefix)) {
                    return;
                }
                if (cmd.validateChecks(message, true)) {
                    fields.push(field);
                }
            }
        );

        if (fields.length > maxCommands) {
            let currentPage = parseInt(args[args.length - 1]) || 1;
            let pageAmount = 1 + parseInt(fields.length / maxCommands);

            if (currentPage < 1 || currentPage > pageAmount) currentPage = 1;

            embed.setFooter(
                `Page ${currentPage} of ${pageAmount}. Use ${prefix}${eventEmitter.action.name} [command] <number>`
            );
            fields = fields.slice((currentPage - 1) * maxCommands, currentPage * maxCommands);
        }
    }

    if (fields) {
        embed.addFields(fields);
    }
    if (thumbnailUrl)
        embed.setThumbnail(thumbnailUrl);
    message.channel.send(embed);
};

function truncateStr(str, max) {
    if (str.length > max)
        return `${str.substr(0, max - 3)}...`;
    return str;
}
