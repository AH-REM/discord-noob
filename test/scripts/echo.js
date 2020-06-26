'use strict';

exports.run = (options, eventEmitter, content) => {
    eventEmitter.eventArgs[0].channel.send(content)
        .catch(console.error);
};
