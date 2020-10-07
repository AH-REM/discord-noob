'use strict';

const fs = require('fs');
const path = require('path');
const Util = require('../util/Util');
const ModuleManager = require('../managers/ModuleManager');

/**
 * An API for the modules to store and retrieve persistent data through the bot, without having to do it themselves.
 */
class DataStorage {
    constructor(client) {
        this.client = client;

        this.dataStructures = {};

        this.populateDataStructures();
        const DataModel = ModuleManager.load(client, "dataModel", client.noobOptions.dataModel);
        this.dataModel = new DataModel(client, this, client.noobOptions.dataSettings);

    }

    set(name, columns, value) {
        this.dataModel.set(name, columns, value);
    }

    get(name, columns) {
        return this.dataModel.get(name, columns);
    }

    populateDataStructures() {
        const defaultDir = path.join(__dirname, "../modules/dataStructures/");
        for (let name of fs.readdirSync(defaultDir)) {
            const n = name.replace(/.json$/, '');
            this.dataStructures[n] = require(path.join(defaultDir, n));
        }

        if (this.client.noobOptions.dataStructures) {
            const customFolder = Util.getCurrentPath(this.client.noobOptions.dataStructures);
            if (!fs.existsSync(customFolder)) return;
            const customFiles = fs.readdirSync(customFolder);
            for (let name of customFiles) {
                const n = name.replace(/.json$/, '');
                this.dataStructures[n] = require(path.join(customFolder, n));
            }
        }
    }

    default(name) {
        return this.dataStructures[name].default;
    }
}

module.exports = DataStorage;