exports.run = (options, eventEmitter) => {
    if (!eventEmitter.guild) {
        return false;
    }

    let ownerId = eventEmitter.guild.owner.id;

    if (eventEmitter.event in ['command', 'message']) {
        return eventEmitter.eventArgs[0].member.id === ownerId;
    }
}