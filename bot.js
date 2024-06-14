const { Client, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const { token } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const commands = [{ command: "!ping", response: "PONG" }];
const rankCommand = "?rank ";

client.on("messageCreate", (message) => {
  const msg = message.content;
  const { member } = message;
  const memberRoles = member.roles.cache.filter((r) =>
    r.name.toLowerCase().includes("mead")
  );

  if (message.author.bot) {
    return "Bot message -- ignored";
  }

  if (msg.toLowerCase().startsWith(rankCommand)) {
    // requested role
    let rank = msg.substring(rankCommand.length);

    // looks for requested role in list
    const role = message.guild.roles.cache.find((r) => {
      if (rank === "10") rank = "10 ";
      return (
        r.name.toLowerCase() === rank.toLowerCase() ||
        r.name.toLowerCase().includes(rank.toLowerCase())
      );
    });
    if (!role) {
      return message.channel.send(`The role ${rank} is not a valid role.`);
    }

    memberRoles.forEach((r) => member.roles.remove(r.id));

    member.roles.add(role.id);
    message.channel
      .send(`You have been assigned to role "${role.name}"`)
      .catch((error) => console.error(error));
  }

  for (const option of commands) {
    if (option.command === msg || msg.includes(option.command)) {
      message.channel
        .send(option.response)
        .catch((error) => console.error(error));
    }
  }

  const getListOfCommands = (com) => {
    let commandList = [];

    commandList = com.map((command) => `${command.command}\n`);

    return commandList;
  };
  if (msg == "!list") {
    const commandListHeader = "\n**Available Bot Commands**\n";
    const commandList = getListOfCommands(commands);
    const formattedList = `${commandListHeader}${commandList}`;
    const patched = formattedList.replaceAll(",", "");
    message.channel.send(patched).catch((error) => console.error(error));
  }
});

client.login(token);
