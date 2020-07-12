'use strict';

exports.run = (options, eventEmitter, ...content) => {
    if (eventEmitter.event !== "command") return;

    eventEmitter.eventArgs[0].channel.send(content.join(' '))
        .catch(console.error);
};

exports.calcMin = () => 1;