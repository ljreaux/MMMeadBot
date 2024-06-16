import { Message } from "discord.js";
import Command from "./models/commands";
import { getRecipes } from "./recipes";

const ranks = [
  "Beginner",
  "10 Meads",
  "20 Meads",
  "25 Meads",
  "30 Meads",
  "40 Meads",
  "50 Meads",
  "75 Meads",
  "100 Meads",
];

const rankString = ranks.reduce((acc, r) => {
  return `${acc}\n- ${r}`;
});

export interface CommandType {
  command: string;
  response: string;
}

export const getCommands = async () => await Command.find();

export const rankCommand = "?rank ";
export const isUnauthorized = (rank: string) => {
  let unauthorized = false;
  const noRoles = [
    "Administrator",
    "Moderator",
    "Mazer of the Week",
    "Patreon Bot",
    "Discord Mead Leader",
    "MMM Patron",
    "Mead Bot",
    "Rythm",
    "Server Booster",
    "EasyPoll",
    "Live Countdown Bot",
    "YouTube Member",
    "technician",
    "YouTube",
    "YT Bot",
    "UMM2024",
    "UMM 2024 Purgatory Member",
  ];
  noRoles.forEach((item) => {
    if (
      item.toLowerCase() === rank.toLowerCase() ||
      item.toLowerCase().includes(rank.toLowerCase())
    ) {
      unauthorized = true;
    }
  });
  return unauthorized;
};

export const handleCommands = async (msg: string, message: Message) => {
  const recipes = await getRecipes();
  const commands = await getCommands();

  const recipesString = recipes
    .map((recipe) => recipe.name)
    .reduce((acc, r) => `${acc}\n- ${r}`);

  for (let option of commands) {
    if (msg.includes("!recipes ")) return;
    if (option.command === msg || msg.startsWith(option.command)) {
      if (msg.toLowerCase().startsWith("!listranks"))
        option.response += ` \n- ${rankString}`;
      if (msg === "!recipes") option.response += ` \n- ${recipesString}`;
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
};
