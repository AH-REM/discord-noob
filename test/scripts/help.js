const Command = require('../../src/structures/Command');
const Discord = require('discord.js');

module.exports = (options, message) => {
    let bot = message.client; // all those should be script_options, TODO
    let prefix = bot.options.prefix;
    let title = "Commands";
    let description = `**Prefix:** ${prefix}`;
    let color = 0;
    let thumbnailUrl = bot.user.avatarURL();
    let fields = [];
    let maxLength = 60;

    let commandHolder = bot; //abstraction to allow Groups later on
    let target;
    let counter = 2;
    let goOn = true;
    while (counter < arguments.length && goOn) {
        goOn = false;
        for (let command of commandHolder.managers.command.cache.commands) {
            if (command.name === arguments[counter]) {
                target = command;
                break;
            }
        }
        counter += 1;
    }
    if (!target)
        target = commandHolder;
    if (target instanceof Command) {
        let field = { "name": `**${target.name} *${target.usage}* **`, "value": `${target.description}` };
        fields.push(field);
    }
    else {
        for (let command of target.managers.command.cache.commands) {
            let field = { "name": `**${command.name}**`, "value": `${truncateStr(command.description, maxLength)}` };
            fields.push(field);
        }
    }
    let embed = new Discord.MessageEmbed({ "title": title, "description": description, "color": color, "fields": fields });
    if (thumbnailUrl)
        embed.setThumbnail(thumbnailUrl);
    message.channel.send(embed);
};
