//
// reload a command
//

const {SlashCommandBuilder} = require("discord.js");
const {pixId} = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("reloads a command")
    .addStringOption((option) => option.setName("command").setDescription("the command to reload").setRequired(true)),
    async execute(interaction) {
        // check if pix (just in case)
        if (interaction.user.id != pixId) {
            return interaction.reply("you need to be pix to do this!!")
        }
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply(`there is no command with name \`${commandName}\`!`);
        }

        delete require.cache[require.resolve(`./${command.data.name}.js`)];

        try {
            const newCommand = require(`./${command.data.name}.js`);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`command \`${newCommand.data.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            await interaction.reply(
                `there was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``,
            );
        }
    },
};
