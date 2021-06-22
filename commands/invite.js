const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "invite",
  description: "Добавьте данного бота на свой сервер.",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["inv"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let embed = new MessageEmbed()
      .setAuthor(
        "Пригласить бота",
        client.user.displayAvatarURL()
      )
      .setColor("#303136")
      .setDescription(
       `[Добавить бота на свой сервер](https://discord.com/api/oauth2/authorize?client_id=854453039166914592&permissions=8&scope=bot)`
      );
    message.channel.send(embed);
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
    let embed = new MessageEmbed()
      .setAuthor(
        "Пригласить бота",
        client.user.displayAvatarURL()
      )
      .setColor("#303136")
      .setDescription(
        `[Добавить бота на свой сервер](https://discord.com/api/oauth2/authorize?client_id=854453039166914592&permissions=8&scope=bot)`
      );
    interaction.send(embed);
  },
  },
};
