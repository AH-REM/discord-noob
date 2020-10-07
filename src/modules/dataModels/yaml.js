const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const Util = require('../../util/Util');

class YamlDataModel {
    constructor(client, dataStorage, settings) {
        this.client = client;
        this.dataStorage = dataStorage;

        this.cache = new Map();
        this.dataDir = Util.getCurrentPath(settings.path);

        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir);
        }

        this.reload();
    }

    /**
     * Fills up the cache with the persistent data from the files.
     */
    reload() {
        for (let filename of fs.readdirSync(this.dataDir)) {
            const data = fs.readFileSync(path.join(this.dataDir, filename), { encoding:'utf8', flag:'r' });
            const json = YAML.parse(data);

            this.cache.set(filename.replace(/.yml$/, ''), json);
        }
    }

    set(name, columns, value) {
        const definition = this.dataStorage.dataStructures[name];

        if (!definition) {
            console.error(`No table definition found for the ${name} table.`);
            return null;
        }
        if (!this.cache.get(name))
            this.cache.set(name, {});

        let table = this.cache.get(name);
        let pointer = table;

        for (let i=0; i<definition.columns.length - 2; i+=1) {
            let filter = columns[definition.columns[i]];
            if (filter) {
                if (!pointer[filter]){
                    pointer[filter] = {};
                }
                pointer = pointer[filter];
            } else {
                console.error("The columns provided don't fit the table definition.")
                return null;
            }
        }

        pointer[columns[definition.columns[definition.columns.length - 2]]] = value;

        const data = YAML.stringify(table);
        fs.writeFileSync(path.join(this.dataDir, name + ".yml"), data);
    }

    get(name, columns) {
        const definition = this.dataStorage.dataStructures[name];

        if (!definition) {
            console.error(`No table definition found for the ${name} table.`);
            return null;
        }

        let element = this.cache.get(name) || {};

        return YamlDataModel.filterElement(element, columns, definition.columns);

    }

    static filterElement(obj, columns, definitions) {
        let temp = [];

        if (!(definitions.length - 1)) {
            temp[0] = {};
            temp[0][definitions[0]] = obj;
        } else {
            for (let [key, val] of Object.entries(obj)) {
                if (columns[definitions[0]]) {
                    if (key === columns[definitions[0]]) {
                        let subResult = YamlDataModel.filterElement(val, columns, definitions.slice(1));
                        subResult.forEach(el => {
                            el[definitions[0]] = key;
                        });
                        temp = temp.concat(subResult);
                    }
                } else {
                    let subResult = YamlDataModel.filterElement(val, columns, definitions.slice(1));
                    subResult.forEach(el => {
                        el[definitions[0]] = key;
                    });
                    temp = temp.concat(subResult);
                }
            }
        }
        return temp;
    }
}

module.exports = YamlDataModel;