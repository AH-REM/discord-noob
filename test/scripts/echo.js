module.exports = (command, message, content) => {
    message.channel.send(content)
        .catch(console.error);
};
