// ping-like command
const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("poke")
    .setDescription("pokes pixie bot!"),
    async execute(interaction) {
        await interaction.reply("kyaa ><");
    },
};
