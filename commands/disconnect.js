const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "disconnect",
  description: "Остановить песню в войсе сервера.",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["leave", "exit", "quit", "dc", "stop"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!message.member.voice.channel) return client.sendTime(message.channel, "Вы должны быть в голосовом канале, используйте эту команду");
    if (!player) return client.sendTime(message.channel,"Сейчас ничего не играет...");
    await client.sendTime(message.channel,"Отключился");
    await message.react("✅");
    player.destroy();
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

      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "Вы должны быть в голосовом канале, чтобы использовать эту команду."
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          `Вы должны быть в ${guild.me.voice.channel} чтобы использовать эту команду.`
        );

      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "Сейчас ничего не играет..."
        );
      player.destroy();
      client.sendTime(
        interaction,
        "Отключение"
      );
    },
  },
};
