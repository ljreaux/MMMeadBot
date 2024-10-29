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

const rankString = ranks.reduce((acc, r) => `${acc}\n- ${r}`);

export interface CommandType {
  command: string;
  response: string;
}

export const getCommands = async () => await Command.find();

export const handleCommands = async (msg: string, message: Message) => {
  const recipes = await getRecipes();
  const commands = await getCommands();

  const recipesString = recipes
    .map((recipe) => recipe.name)
    .reduce((acc, r) => `${acc}\n- ${r}`);

  for (const option of commands) {
    if (msg.includes("!recipes ") || msg.includes("!video ")) return;

    if (msg.startsWith(option.command)) {
      if (msg.toLowerCase().startsWith("!listranks"))
        option.response += ` \n- ${rankString}`;

      if (msg === "!recipes") option.response += ` \n- ${recipesString}`;

      message.channel
        .send(option.response)
        .catch((error) => console.error(error));
    }
  }

  const getListOfCommands = (com: CommandType[]) => {
    const commandList = com.map((command) => `${command.command}\n`);
    commandList.push("!abv");
    return commandList;
  };

  if (msg == "!list") {
    const commandListHeader = "\n**Available Bot Commands**\n";
    const commandList = getListOfCommands(commands);
    const formattedList = `${commandListHeader}${commandList}`;
    const patched = formattedList.replaceAll(",", "");

    return message.channel.send(patched).catch((error) => console.error(error));
  }
};
