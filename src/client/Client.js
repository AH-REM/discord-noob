'use strict';

const Discord = require('discord.js');
const YAML = require('yaml');
const fs = require('fs');

const { addExtension } = require('../util/Utils');
const { DefaultOptionsClient } = require('../util/Constants');
const EventLoader = require('../util/EventLoader');
const Command = require('../util/Command');

class Client {

    /**
     * @param {Object} options - Options for the client
     */
    constructor(options = {}) {

        this.options = { ...DefaultOptionsClient, ...options }
        this.bot = new Discord.Client();

        // Commands list
        this.commands = new Map();

        EventLoader(this);
        this.login();

    }

    login() {
        this.bot
            .login(this.options.token)
            .catch(console.error);
    }

    /**
     * Load yaml file
     * @param {string} path
     */
    load(path) {
        try {

            const file = fs.readFileSync(addExtension(path), 'utf8');
            const json = YAML.parse(file);

            for (let [ name, options ] of Object.entries(json)) {

                const cmd = new Command(name, options);
                if (cmd.isAvailable()) {

                    name = cmd.options.prefix ? this.options.prefix + name : name;

                    this.commands.set(name, cmd);

                }
                else throw new Error(`The command "${name}" has not message to send.`);

            }

        }
        catch(err) {
            console.error(err);
        }
    }

}

module.exports = Client;
