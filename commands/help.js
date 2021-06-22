const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Информация о данном боте.",
  usage: "[команда]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["command", "commands", "cmd", "cmds"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
   run: async (client, message, args, { GuildDB }) => {
    let Commands = client.commands.map(
      (cmd) =>
        `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${
          cmd.name
        }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
    );

    let Embed = new MessageEmbed()
            .setAuthor(
            `Информация — О боте ${client.user.username}`,
              client.config.IconURL
            )
            .setColor("#303136")
            .setDescription(`${Commands.join("\n")}
  `);
    if (!args[0]) message.channel.send(Embed);
    else {
      let cmd =
        client.commands.get(args[0]) ||
        client.commands.find((x) => x.aliases && x.aliases.includes(args[0]));
      if (!cmd)
        return client.sendTime(message.channel, `Невозможно найти эту команду.`);

      let embed = new MessageEmbed()
        .setAuthor(`О команде: ${cmd.name}`, client.config.IconURL)
        .setDescription(cmd.description)
        .setColor("#303136")
        //.addField("Name", cmd.name, true)
        .addField("Значения", `\`${cmd.aliases.join(", ")}\``, true)
        .addField(
          " Применение",
          `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\``,
          true
        )
        .addField(
          "Разрешения",
          "Пользователь: " +
            cmd.permissions.member.join(", ") +
            "\nBot: " +
            cmd.permissions.channel.join(", "),
          true
        )
        .setFooter(
          `Префикс по умолчанию бота: +`
        );

      message.channel.send(embed);
    }
  },

SlashCommand: {
    options: [
      {
        name: "command",
        description: "Получить информацию о конкретной команде",
        value: "command",
        type: 3,
        required: false
      },
    ],
    /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

    run: async (client, interaction, args, { GuildDB }) => {
      let Commands = client.commands.map(
        (cmd) =>
          `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
      );
  
      let Embed = new MessageEmbed()
            .setAuthor(
              `Информация о боте ${client.user.username}`,
              client.config.IconURL
            )
           .setColor("#303136")
            .setDescription(`${Commands.join("\n")}
  `);
      if (!args) return interaction.send(Embed);
      else {
        let cmd =
          client.commands.get(args[0].value) ||
          client.commands.find((x) => x.aliases && x.aliases.includes(args[0].value));
        if (!cmd)
          return client.sendTime(interaction, `Невозможно найти эту команду.`);
  
        let embed = new MessageEmbed()
          .setAuthor(`Команда: ${cmd.name}`, client.config.IconURL)
          .setDescription(cmd.description)
          .setColor("#303136")
          //.addField("Никнейм", cmd.name, true)
          .addField("Значения", cmd.aliases.join(", "), true)
          .addField(
            "Применение",
            `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${
              cmd.name
            }\`${cmd.usage ? " " + cmd.usage : ""}`,
            true
          )
          .addField(
            "Разрешения",
            "Пользователь: " +
              cmd.permissions.member.join(", ") +
              "\nBot: " +
              cmd.permissions.channel.join(", "),
            true
          )
          .setFooter(
            `Префикс - ${
              GuildDB ? GuildDB.prefix : client.config.DefaultPrefix
            }`
          );
  
        interaction.send(embed);
      }
  },
}};
