module.exports = {
  Admins: ["523140343441391620", "517008874209935360"], //Админы бота
  ExpressServer: true,//If you wanted to make the website run or not
  DefaultPrefix: process.env.Prefix || "-", //Префикс по умолчанию бота на серверах
  Port: 3000, //Which port website gonna be hosted
  SupportServer: "https://discord.gg/relaxtime", //Сервер поддержки бота
  Token: process.env.Token || "ODU2ODM2NzA5NDM4NTg2OTQw.YNG1Xg.PVsiVK_1RgBq2s-9h5jlyXWhKJo", //Discord Bot Token
  ClientID: process.env.Discord_ClientID || "856836709438586940", //Discord Client ID
  ClientSecret: process.env.Discord_ClientSecret || "8w0i57guzfVC4ISow4VK42CYeDUaCA4C", //Discord Client Secret
  Scopes: ["identify", "guilds", "applications.commands"], //Discord OAuth2 Scopes
  CallbackURL: "/api/callback", //Discord OAuth2 Callback URL
  "24/7": true, //If you want the bot to be stay in the vc 24/7
  CookieSecret: "Pikachu is cute", //A Secret like a password
  IconURL: "https://media.discordapp.net/attachments/854531348093206579/854533308246654976/20210616_043001.png", //URL of all embed author icons | Dont edit unless you dont need that Music CD Spining
  Permissions: 2205280576, //Bot Inviting Permissions
  Website: process.env.Website || "http://localhost", //Website where it was hosted at includes http or https || Use "0.0.0.0" if you using Heroku

  //Lavalink
   Lavalink: {
    id: "Main",
    host: "lava.link",
    port: 80,
    pass: "youshallnotpass", 
  },
  
  //Alternate Lavalink
  /*
  Lavalink: {
    id: "Main",
    host: "lava.sudhan.tech",
    port: 1234,
    pass: "CodingWithSudhan", 
  },
  */

  //Please go to https://developer.spotify.com/dashboard/
  Spotify: {
    ClientID: process.env.Spotify_ClientID || "", //Spotify Client ID
    ClientSecret: process.env.Spotify_ClientSecret || "", //Spotify Client Secret
  },
};
