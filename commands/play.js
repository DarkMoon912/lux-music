const { Util, MessageEmbed } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
    name: "play",
    description: "Воспроизвести свою любимую музыку.",
    usage: "[песня]",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["p"],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        if (!message.member.voice.channel) return client.sendTime(message.channel, "Вы должны быть в голосовом канале, чтобы что-то слушать!");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, "Вы должны быть в том же голосовом канале, что и я, чтобы использовать эту команду!");
        let SearchString = args.join(" ");
        if (!SearchString) return client.sendTime(message.channel, `**Применение - **\`${GuildDB.prefix}play [трек]\``);
        let CheckNode = client.Manager.nodes.get(client.config.Lavalink.id);
        let Searching = await message.channel.send("Поиск вашего трека...");
        if (!CheckNode || !CheckNode.connected) {
       return client.sendTime(message.channel,"Узел Lavalink не подключен");
        }
        const player = client.Manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: false,
        });

        let SongAddedEmbed = new MessageEmbed().setColor("#303136");

        if (!player) return client.sendTime(message.channel, "Сейчас ничего не играет ...");

        if (player.state != "CONNECTED") await player.connect();

        try {
            if (SearchString.match(client.Lavasfy.spotifyPattern)) {
                await client.Lavasfy.requestToken();
                let node = client.Lavasfy.nodes.get(client.config.Lavalink.id);
                let Searched = await node.load(SearchString);

                if (Searched.loadType === "PLAYLIST_LOADED") {
                    let songs = [];
                    for (let i = 0; i < Searched.tracks.length; i++) songs.push(TrackUtils.build(Searched.tracks[i], message.author));
                    player.queue.add(songs);
                    if (!player.playing && !player.paused && player.queue.totalSize === Searched.tracks.length) player.play();
                    SongAddedEmbed.setAuthor(`Плейлист добавлен в очередь`, message.author.displayAvatarURL());
                    SongAddedEmbed.addField("Поставлен в очередь", `\`${Searched.tracks.length}\` песни`, false);
                    //SongAddedEmbed.addField("Продолжительность плейлиста", `\`${prettyMilliseconds(Searched.tracks, { colonNotation: true })}\``, false)
                    Searching.edit(SongAddedEmbed);
                } else if (Searched.loadType.startsWith("TRACK")) {
                    player.queue.add(TrackUtils.build(Searched.tracks[0], message.author));
                    if (!player.playing && !player.paused && !player.queue.size) player.play();
                    SongAddedEmbed.setAuthor(`Добавлен в очередь`, client.config.IconURL);
                    SongAddedEmbed.setDescription(`[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`);
                    SongAddedEmbed.addField("Автор", Searched.tracks[0].info.author, true);
                    //SongAddedEmbed.addField("Duration", `\`${prettyMilliseconds(Searched.tracks[0].length, { colonNotation: true })}\``, true);
                    if (player.queue.totalSize > 1) SongAddedEmbed.addField("Позиция в очереди", `${player.queue.size - 0}`, true);
                    Searching.edit(SongAddedEmbed);
                } else {
                    return client.sendTime(message.channel, "Не найдено совпадений для - " + SearchString);
                }
            } else {
                let Searched = await player.search(SearchString, message.author);
                if (!player) return client.sendTime(message.channel, "Сейчас ничего не играет...");

                if (Searched.loadType === "NO_MATCHES") return client.sendTime(message.channel, "Не найдено совпадений для -" + SearchString);
                else if (Searched.loadType == "PLAYLIST_LOADED") {
                    player.queue.add(Searched.tracks);
                    if (!player.playing && !player.paused && player.queue.totalSize === Searched.tracks.length) player.play();
                    SongAddedEmbed.setAuthor(`Плейлист добавлен в очередь`, client.config.IconURL);
                    SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
                    SongAddedEmbed.setDescription(`[${Searched.playlist.name}](${SearchString})`);
                    SongAddedEmbed.addField("Поставлен в очередь", `\`${Searched.tracks.length}\` треков`, false);
                    SongAddedEmbed.addField("Продолжительность плейлиста", `\`${prettyMilliseconds(Searched.playlist.duration, { colonNotation: true })}\``, false);
                    Searching.edit(SongAddedEmbed);
                } else {
                    player.queue.add(Searched.tracks[0]);
                    if (!player.playing && !player.paused && !player.queue.size) player.play();
                    SongAddedEmbed.setAuthor(`Добавлен в очередь`, client.config.IconURL);

                    SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
                    SongAddedEmbed.setDescription(`[${Searched.tracks[0].title}](${Searched.tracks[0].uri})`);
                    SongAddedEmbed.addField("Автор", Searched.tracks[0].author, true);
                    SongAddedEmbed.addField("Продолжительность", `\`${prettyMilliseconds(Searched.tracks[0].duration, { colonNotation: true })}\``, true);
                    if (player.queue.totalSize > 1) SongAddedEmbed.addField("Позиция в очереди", `${player.queue.size - 0}`, true);
                    Searching.edit(SongAddedEmbed);
                }
            }
        } catch (e) {
            console.log(e);
            return client.sendTime(message.channel, "Не найдено совпадений для -" + SearchString);
        }
    },

    SlashCommand: {
        options: [
            {
                name: "song",
                value: "song",
                type: 3,
                required: true,
                description: "Воспроизведение музыки в голосовом канале",
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
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);
            const voiceChannel = member.voice.channel;
            let awaitchannel = client.channels.cache.get(interaction.channel_id); /// спасибо тебе за эту идею; -;
            if (!member.voice.channel) return client.sendTime(interaction, "Чтобы использовать эту команду, вы должны находиться в голосовом канале.");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, "Вы должны быть в том же голосовом канале, что и я, чтобы использовать эту команду!");
            let CheckNode = client.Manager.nodes.get(client.config.Lavalink.id);
            if (!CheckNode || !CheckNode.connected) {
              return client.sendTime(interaction,"Узел Lavalink не подключен");
            }
    
            let player = client.Manager.create({
                guild: interaction.guild_id,
                voiceChannel: voiceChannel.id,
                textChannel: interaction.channel_id,
                selfDeafen: false,
            });
            if (player.state != "CONNECTED") await player.connect();
            let search = interaction.data.options[0].value;
            let res;

            if (search.match(client.Lavasfy.spotifyPattern)) {
                await client.Lavasfy.requestToken();
                let node = client.Lavasfy.nodes.get(client.config.Lavalink.id);
                let Searched = await node.load(search);

                switch (Searched.loadType) {
                    case "LOAD_FAILED":
                        if (!player.queue.current) player.destroy();
                        return client.sendError(interaction, `При поиске произошла ошибка`);

                    case "NO_MATCHES":
                        if (!player.queue.current) player.destroy();
                        return client.sendTime(interaction, "Ничего не найдено.");
                    case "TRACK_LOADED":
                        player.queue.add(TrackUtils.build(Searched.tracks[0], member.user));
                        if (!player.playing && !player.paused && !player.queue.length) player.play();
                        let SongAddedEmbed = new MessageEmbed();
                            SongAddedEmbed.setAuthor(`Добавлен в очередь`, client.config.IconURL);
                            SongAddedEmbed.setColor("#303136");
                            SongAddedEmbed.setDescription(`[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`);
                            SongAddedEmbed.addField("Author", Searched.tracks[0].info.author, true);
                            if (player.queue.totalSize > 1) SongAddedEmbed.addField("Позиция в очереди", `${player.queue.size - 0}`, true);
                            return interaction.send(SongAddedEmbed);

                    case "SEARCH_RESULT":
                        player.queue.add(TrackUtils.build(Searched.tracks[0], member.user));
                        if (!player.playing && !player.paused && !player.queue.length) player.play();
                        let SongAdded = new MessageEmbed();
                            SongAdded.setAuthor(`Добавлен в очередь`, client.config.IconURL);
                            SongAdded.setColor("#303136");
                            SongAdded.setDescription(`[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`);
                            SongAdded.addField("Автор", Searched.tracks[0].info.author, true);
                            if (player.queue.totalSize > 1) SongAdded.addField("Позиция в очереди", `${player.queue.size - 0}`, true);
                            return interaction.send(SongAdded);


                    case "PLAYLIST_LOADED":
                        let songs = [];
                        for (let i = 0; i < Searched.tracks.length; i++) songs.push(TrackUtils.build(Searched.tracks[i], member.user));
                        player.queue.add(songs);
                        if (!player.playing && !player.paused && player.queue.totalSize === Searched.tracks.length) player.play();
                        let Playlist = new MessageEmbed();
                        Playlist.setAuthor(`Плейлист добавлен в очередь`, client.config.IconURL);
                        Playlist.setDescription(`[${Searched.playlistInfo.name}](${interaction.data.options[0].value})`);
                        Playlist.addField("Поставлен в очередь", `\`${Searched.tracks.length}\` треков`, false);
                        return interaction.send(Playlist);
                }
            } else {
                try {
                    res = await player.search(search, member.user);
                    if (res.loadType === "LOAD_FAILED") {
                        if (!player.queue.current) player.destroy();
                        return client.sendError(interaction, `При поиске произошла ошибка`);
                    }
                } catch (err) {
                    return client.sendError(interaction, `При поиске произошла ошибка: ${err.message}`);
                }
                switch (res.loadType) {
                    case "NO_MATCHES":
                        if (!player.queue.current) player.destroy();
                        return client.sendTime(interaction, "Ничего не найдено.");
                    case "TRACK_LOADED":
                        player.queue.add(res.tracks[0]);
                        if (!player.playing && !player.paused && !player.queue.length) player.play();
                        let SongAddedEmbed = new MessageEmbed();
                            SongAddedEmbed.setAuthor(`Добавлен в очередь`, client.config.IconURL);
                            SongAddedEmbed.setThumbnail(res.tracks[0].displayThumbnail());
                            SongAddedEmbed.setColor("#303136");
                            SongAddedEmbed.setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`);
                            SongAddedEmbed.addField("Автор", res.tracks[0].author, true);
                            SongAddedEmbed.addField("Продолжительность", `\`${prettyMilliseconds(res.tracks[0].duration, { colonNotation: true })}\``, true);
                            if (player.queue.totalSize > 1) SongAddedEmbed.addField("Позиция в очереди", `${player.queue.size - 0}`, true);
                            return interaction.send(SongAddedEmbed);
                            
                    case "PLAYLIST_LOADED":
                        player.queue.add(res.tracks);
                        await player.play();
                        let SongAdded = new MessageEmbed();
                        SongAdded.setAuthor(`Плейлист добавлен в очередь`, client.config.IconURL);
                        SongAdded.setThumbnail(res.tracks[0].displayThumbnail());
                        SongAdded.setDescription(`[${res.playlist.name}](${interaction.data.options[0].value})`);
                        SongAdded.addField("Поставлен в очередь", `\`${res.tracks.length}\` треков`, false);
                        SongAdded.addField("Продолжительность плейлиста", `\`${prettyMilliseconds(res.playlist.duration, { colonNotation: true })}\``, false);
                        return interaction.send(SongAdded);
                    case "SEARCH_RESULT":
                        const track = res.tracks[0];
                        player.queue.add(track);
                    

                        if (!player.playing && !player.paused && !player.queue.length) {
                            let SongAddedEmbed = new MessageEmbed();
                            SongAddedEmbed.setAuthor(`Добавлен в очередь`, client.config.IconURL);
                            SongAddedEmbed.setThumbnail(track.displayThumbnail());
                            SongAddedEmbed.setColor("#303136");
                            SongAddedEmbed.setDescription(`[${track.title}](${track.uri})`);
                            SongAddedEmbed.addField("Автор", track.author, true);
                            SongAddedEmbed.addField("Продолжительность", `\`${prettyMilliseconds(track.duration, { colonNotation: true })}\``, true);
                            if (player.queue.totalSize > 1) SongAddedEmbed.addField("Позиция в очереди", `${player.queue.size - 0}`, true);
                            player.play();
                            return interaction.send(SongAddedEmbed);
                            
                        } else {
                            let SongAddedEmbed = new MessageEmbed();
                            SongAddedEmbed.setAuthor(`Добавлен в очередь`, client.config.IconURL);
                            SongAddedEmbed.setThumbnail(track.displayThumbnail());
                            SongAddedEmbed.setColor("#303136");
                            SongAddedEmbed.setDescription(`[${track.title}](${track.uri})`);
                            SongAddedEmbed.addField("Автор", track.author, true);
                            SongAddedEmbed.addField("Продолжительность", `\`${prettyMilliseconds(track.duration, { colonNotation: true })}\``, true);
                            if (player.queue.totalSize > 1) SongAddedEmbed.addField("Позиция в очереди", `${player.queue.size - 0}`, true);
                            interaction.send(SongAddedEmbed);
                        }
                }
            }
        },
    },
};