//--------------------------------
//         PIXIE BOT JS
//--------------------------------

// discord.js requirements
const fs = require("node:fs");
const path = require("node:path");
const {Client, Collection, Events, GatewayIntentBits, MessageFlags} = require("discord.js");
const {token} = require("./config.json");

// new client instance
const client = new Client({intents:[GatewayIntentBits.Guilds]});

// command stuff
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // new item in collection with key as command name and value as exported moduel
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] the command at ${filePath} is missing a required "data" or "execute" property`);
        }
    }
}

// event stuff
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// cooldown stuff
client.cooldowns = new Collection();

// log into discord with token
client.login(token);
