'use strict';

exports.run = (command, message, content) => {
    message.channel.send(content)
        .catch(console.error);
};
