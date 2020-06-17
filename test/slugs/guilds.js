'use strict';

module.exports = (client, eventEmitter, arg = 'name') => {

    let response;

    switch (arg) {
        case 'name':
            response = client.guilds.cache.map(guild => guild.name);
            break;

        case 'id':
            response = client.guilds.cache.map(guild => guild.id);
            break;

        case 'size':
            response = client.guilds.cache.size;
            break;

        default:
            // ...
    }

    if (response instanceof Array) response = response.join(', ');

    return response;

}
