'use strict';

const fs = require('fs');
const Util = require('../util/Util');

class ModuleManager {

    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    static load(client, type, name) {
        let moduleLoaded = {};
        switch (type) {
            case "script" : {
                if (client.noobOptions.scripts && fs.existsSync(Util.getCurrentPath(client.noobOptions.scripts + name + ".js")))
                    moduleLoaded = require(Util.getCurrentPath(client.noobOptions.scripts + name));
                else
                    moduleLoaded = require('../modules/scripts/' + name);
            } break;
            case "check" : {
                if (client.noobOptions.checks && fs.existsSync(Util.getCurrentPath(client.noobOptions.checks + name + ".js"))) {
                        moduleLoaded = require(Util.getCurrentPath(client.noobOptions.scripts + name));
                }
                else {
                    moduleLoaded = require('../modules/checks/' + name);
                }
            } break;
        }
        return moduleLoaded;
    }

}

module.exports = ModuleManager;
