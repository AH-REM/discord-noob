'use strict';

module.exports = (options, message, content) => {
    message.channel.send(content)
        .catch(console.error);
};
