const { MessageEmbed } = require("discord.js");
require("moment-duration-format");
const cpuStat = require("cpu-stat");
const moment = require("moment");

module.exports = {
    name: "stats",
    description: "Вся статистика данного бота.",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["about", "ping", "info"],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message) => {
            const { version } = require("discord.js")
            cpuStat.usagePercent(async function (err, percent, seconds) {
            if (err) {
                return console.log(err);
            }
            const duration = moment.duration(message.client.uptime).format(" D[d], H[h], m[m]");

            const embed = new MessageEmbed()
            embed.setColor("#303136")
            embed.setTitle(`Статистика от ${client.user.username}`)
            embed.addFields({
                name: 'Пинг',
                value: `**${Math.round(client.ws.ping)}ms**`,
                inline: true
            },
            {
                name: 'Аптайм',
                value: `**${duration}**`,
                inline: true
            },{
                name: 'Память',
                value: `**${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb**`,
                inline: true
            })

            embed.addFields({
                name: 'Сервера',
                value: `**${client.guilds.cache.size}**`,
                inline: true
            },
            {
                name: 'Пользователей',
                value: `**${client.users.cache.size}**`,
                inline: true
            },{
                name: 'Задержка API',
                value: `**${(message.client.ws.ping)}ms**`,
                inline: true
            })
            embed.addFields({
                name: 'Версия',
                value: `**v${require("../package.json").version}**`,
                inline: true
            },{
                name: 'Discord.js', 
                value: `**v${version}**`,
                inline: true
            },{
                name: 'Node',
                value: `**${process.version}**`,
                inline: true
            })

        return message.channel.send(embed);
    })
},
SlashCommand: {
/**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
 run: async (client, interaction) => {
        const { version } = require("discord.js")
        cpuStat.usagePercent(async function (err, percent, seconds) {
        if (err) {
            return console.log(err);
        }
        const duration = moment.duration(client.uptime).format(" D[d], H[h], m[m]");

        const embed = new MessageEmbed()
        embed.setColor("#303136")
        embed.setTitle(`Статистика от ${client.user.username}`)
        embed.addFields({
            name: 'Пинг',
            value: `**${Math.round(client.ws.ping)}ms**`,
            inline: true
        },
        {
            name: 'Аптайм',
            value: `**${duration}**`,
            inline: true
        },{
            name: 'Память',
            value: `**${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb**`,
            inline: true
        })

        embed.addFields({
            name: 'Сервера',
            value: `**${client.guilds.cache.size}**`,
            inline: true
        },
        {
            name: 'Пользователей',
            value: `**${client.users.cache.size}**`,
            inline: true
        },{
            name: 'Задержка API',
            value: `**${(client.ws.ping)}ms**`,
            inline: true
        })
        embed.addFields({
            name: 'Версия',
            value: `**v${require("../package.json").version}**`,
            inline: true
        },{
            name: 'Discord.js', 
            value: `**v${version}**`,
            inline: true
        },{
            name: 'Node',
            value: `**${process.version}**`,
            inline: true
        })

    return interaction.send(embed);
})
}
}
};