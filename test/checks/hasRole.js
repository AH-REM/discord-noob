exports.run = (options, message) => {
    let roleId = roleConverter(options.role, message);
    if (!roleId) {
        console.error(`No role with the ID/name ${options.role} could be found, this check will be disabled.`);
        return true;
    }

    return message.member.roles.cache.has(roleId);
}

function roleConverter(roleResolvable, message) {
    // Check if it's a roleID
    let role = message.guild.roles.cache.get(roleResolvable);
    // Check if it's a role name
    if (!role) {
        role = message.guild.roles.cache.find((role) => role.name === roleResolvable);
    }
    if (role) {
        return role.id;
    }
    return null;
}