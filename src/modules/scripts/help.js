// const Noob = require('discord-noob');
const Noob = require('../../index');
const Discord = require('discord.js');

exports.run = function(options, message) {
    let bot = message.client;
    let prefix = bot.noobOptions.prefix;

    let title = options.help.title || "Commands";
    let description = options.help.description || `**Prefix:** ${prefix}`;
    let color = options.help.color || 0;
    let thumbnailUrl = bot.user.avatarURL();
    let maxLength = 60;

    let fields = [];
    let commandHolder = bot;
    let target;
    let counter = 2;
    let goOn = true;
    while (counter < arguments.length && goOn) {
        goOn = false;
        let command = commandHolder.managers['command'].cache.commands.get(arguments[counter]) || commandHolder.managers['command'].cache.aliases.get(arguments[counter]);
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
            title = target.name;
            description = target.values.description || '';
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
    }
    let embed = new Discord.MessageEmbed({ "title": title, "description": description, "color": color});
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
