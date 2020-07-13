'use strict';

const fs = require('fs');
const path = require('path');
const Util = require('../util/Util');

class ModuleManager {

    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    static load(client, type, name) {
        let moduleLoaded = {};
        type += 's';

        if (client.noobOptions[type] && fs.existsSync(Util.getCurrentPath(path.join(client.noobOptions[type], name + ".js")))) {
            moduleLoaded = require(Util.getCurrentPath(path.join(client.noobOptions[type], name)));
        } else if (fs.existsSync(path.join(__dirname, '/../modules/', type, name + ".js"))) {
            moduleLoaded = require(path.join('../modules/', type, name));
        }
        
        return moduleLoaded;
    }

}

module.exports = ModuleManager;
