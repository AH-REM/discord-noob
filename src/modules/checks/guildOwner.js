exports.run = (options, eventEmitter) => {
    if (!eventEmitter.guild) {
        return false;
    }

    let ownerId = eventEmitter.guild.owner.id;

    if (['command', 'message'].includes(eventEmitter.event)) {
        return eventEmitter.eventArgs[0].member.id === ownerId;
    }
}