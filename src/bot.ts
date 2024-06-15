import {
  Client,
  Events,
  GatewayIntentBits,
  Message,
  PermissionsBitField,
  TextChannel,
} from "discord.js";

import dotenv from "dotenv";
dotenv.config();
const { token, welcomeChannel = "", botSpamChannel = "" } = process.env;

import { commands, CommandType, rankCommand, isUnauthorized } from "./commands";
import { recipes, RecipeType } from "./recipes";
import { getAbv } from "./abvCommand";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

client.login(token);
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("messageCreate", (message: Message) => {
  // early return if the message is sent by the bot
  if (message.author.bot) {
    return;
  }

  const msg = message.content;
  const { member } = message;

  if (msg.includes("?kick")) {
    if (
      !message.member
        ?.permissionsIn(message.channel.id)
        .has(PermissionsBitField.Flags.Administrator)
    )
      return;
    let [, user] = msg.split(" ");
    user = user.substring(2, user.length - 2);
    if (!user) {
      message.channel.send("You need to specify a user to kick.");
      return;
    }
    console.log(user);
    const userToKick = message.guild?.members.cache.find(
      (member) => member.user.id === user
    );
    if (!userToKick) {
      message.channel.send("User not found.");
      return;
    }
    message.guild?.members.kick(userToKick);
    message.channel.send(`${userToKick.user.tag} has been kicked.`);
    return;
  }

  // gets members current roles
  const memberRoles = member?.roles.cache.filter((r) => {
    return (
      r.name.toLowerCase().includes("mead") ||
      r.name.toLowerCase() === "beginner"
    );
  });

  if (msg.toLowerCase().startsWith(rankCommand)) {
    // requested role
    let rank = msg.substring(rankCommand.length);

    // prevent from assigning privileged roles
    if (isUnauthorized(rank)) {
      message.channel.send(
        `You are in this discord server, but we do not grant you the rank of ${rank}`
      );
      return;
    }

    // looks for requested role in list
    const role = message.guild?.roles.cache.find((r) => {
      // edge case coverage, if user enters '10' it assigns 100 Meads without this
      if (rank === "10") rank = "10 ";
      return (
        r.name.toLowerCase() === rank.toLowerCase() ||
        r.name.toLowerCase().includes(rank.toLowerCase())
      );
    });
    if (!role) {
      message.channel.send(`The role ${rank} is not a valid role.`);
      return;
    }
    // removes other mead community roles
    memberRoles?.forEach((r) => member?.roles.remove(r.id));

    member?.roles.add(role.id);
    message.channel
      .send(`You have been assigned to role "${role.name}"`)
      .catch((error) => console.error(error));
    return;
  }

  if (msg.toLowerCase().startsWith("!recipes")) {
    const [, recipe] = msg.split(" ");
    const recipeString = recipe?.toLowerCase() || "";
    if (recipe && recipeString in recipes) {
      message.channel.send(recipes[recipeString as keyof RecipeType]);
      return;
    } else if (recipe) {
      message.channel.send(
        `The recipe ${recipe} is not a valid recipe command.`
      );
      return;
    }
  }

  if (msg.toLowerCase().startsWith("!abv")) {
    const [, first, second] = msg.split(" ");
    const [OG, FG] = [Number(first), Number(second) || 0.996];
    const areInvalid = () => {
      return (
        isNaN(OG) ||
        isNaN(FG) ||
        // checking for validity, ABV < 23%
        OG < FG ||
        OG > 1.22 ||
        FG > 1.22 ||
        OG - FG > 0.165
      );
    };

    if (areInvalid()) {
      message.channel.send(
        "Please enter a valid number for OG and FG. Example: !abv 1.050 1.010"
      );
      return;
    }

    const [delle, ABV] = getAbv(OG, FG);
    message.channel.send(
      `An OG of ${OG} and an FG of ${FG} will make ${ABV}% ABV and ${delle} delle units.`
    );
    return;
  }

  for (const option of commands) {
    if (option.command === msg || msg.includes(option.command)) {
      message.channel
        .send(option.response)
        .catch((error) => console.error(error));
    }
  }

  const getListOfCommands = (com: CommandType[]) => {
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

client.on("guildMemberAdd", (member) => {
  const channel = client.channels.cache.get(welcomeChannel) as TextChannel;
  channel.send(
    `Welcome to the MMM Discord Server <@${member.user.id}>!\n Please head over to <#${botSpamChannel}> and run **?rank (rank)** to recieve a rank and join your mini mead making community.\n\nRun **!recipes** to get a list of popular MMM recipes.\n\nYou can find a list of all commands by running **!list**`
  );
});
