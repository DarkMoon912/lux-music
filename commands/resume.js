const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "resume",
    description: "Возобновляет данную музыку в войсе.",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        let player = await client.Manager.get(message.guild.id);
        if (!player) return client.sendTime(message.channel, "Сейчас ничего не играет...");
        if (!message.member.voice.channel) return client.sendTime(message.channel, "Чтобы использовать эту команду, вы должны находиться в голосовом канале!");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, "Вы должны быть в том же голосовом канале, что и я, чтобы использовать эту команду!");

        if (player.playing) return client.sendTime(message.channel, "Музыка уже возобновлена!*");
        player.pause(false);
        await message.react("✅");
    },

    SlashCommand: {
        /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
        run: async (client, interaction, args, { GuildDB }) => {
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);

            if (!member.voice.channel) return client.sendTime(interaction, "Чтобы использовать эту команду, вы должны находиться в голосовом канале.");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, "Вы должны быть в том же голосовом канале, что и я, чтобы использовать эту команду!");

            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "Сейчас ничего не играет...");
            if (player.playing) return client.sendTime(interaction, "Музыка уже возобновлена!");
            player.pause(false);
            client.sendTime(interaction, "⏯ Возобновлено!");
        },
    },
};