'use strict';

exports.run = (options, message, content) => {
    message.channel.send(content)
        .catch(console.error);
};
