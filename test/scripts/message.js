module.exports = (options, message) => {
    const response = getMessage(options);
    if (response) {

        const channel = getChannel(options, message);
        channel.send(response)
            .then(m => {
                addReact(options, m);
            })
            .catch(console.error);

    }
};

function getMessage(options) {
    const rand = Math.floor(Math.random() * options.content.length);
    return options.content[rand];
}

function getChannel(options, message) {
    try {
        const { client } = message;
        const { guild, channel } = options;

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

function addReact(options, message) {
    const { react } = options;
    if (react.length < 1) return;
    for (let emoji of react) {
        // Gérer les erreurs
        message.react(emoji).catch(console.error);
    }
}
