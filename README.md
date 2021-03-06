# discord-noob

<div>
    <p>
        <a href="https://nodei.co/npm/discord-noob/"><img src="https://nodei.co/npm/discord-noob.png?downloads=true&stars=true" alt="npm installnfo"></a>
    </p>
</div>

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Example Usage](#example-usage)

## About

discord-noob is a project to make easily a discord bot based on [discord.js](https://github.com/discordjs/discord.js) for noobs.

- User-friendly
- No programming needed
- YML language

## Installation

This is a [Node.js](https://nodejs.org/) module available through the [npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/). Node.js 13.0.1 or higher is required.

```sh
$ npm install discord-noob
```

## Example usage

```js
// index.js
const path = require('path');
const Noob = require('discord-noob');

const noob = new Noob.Client({
    token: 'token',
    prefix: '!'
});

noob.load(path.join(__dirname, 'command.yml'));
```

```yml
# command.yml
ping:
    unique: true
    message:
        content:
            - pong
        react:
            - 🏓
```

Result:

![pong-test](https://raw.githubusercontent.com/AH-REM/discord-noob/master/images/pong-test.png)
