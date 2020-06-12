module.exports = (command, message) => {
    const response = getMessage(command);
    if (response) {

        const channel = getChannel(command, message);
        channel.send(response)
            .then(m => {
                addReact(command, m);
            })
            .catch(console.error);

    }

    if (command.options.delete > -1)
        message.delete({timeout: command.options.delete});
};

function getMessage(command) {
    const rand = Math.floor(Math.random() * command.options.script_options.content.length);
    return command.options.script_options.content[rand];
}

function getChannel(command, message) {
    try {
        const { client } = message;
        const { guild, channel } = command.options.script_options;

        if (guild && channel) {
            const chan = client.guilds.cache.get(guild).channels.cache.get(channel);
            return chan;
        }
        else return message.channel;
    }
    catch (err) {
        // return err ?
        return message.channel;
    }
}

function addReact(command, message) {
    const { react } = command.options.script_options;
    if (react.length < 1) return;
    for (let emoji of react) {
        // Gérer les erreurs
        message.react(emoji).catch(console.error);
    }
}
