module.exports = (command, message, content) => {
    message.channel.send(content)
        .catch(console.error);

    if (command.options.delete > -1)
        message.delete({timeout: command.options.delete});
};
