'use strict';

module.exports = (client, eventEmitter, arg = 'name') => {

    let response;

    switch (arg) {
        case 'id':
            response = client.guilds.cache.map(guild => guild.id);
            break;

        case 'size':
            response = client.guilds.cache.size;
            break;

        case 'name':
        default:
            response = client.guilds.cache.map(guild => guild.name);
            break;
    }

    if (response instanceof Array) response = response.join(', ');

    return response;

}
