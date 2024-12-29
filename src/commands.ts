import { Message } from "discord.js";
import Command from "./models/commands";
import { getRecipes } from "./recipes";

export interface CommandType {
  command: string;
  response: string;
}

export const getCommands = async () => await Command.find();

export const handleCommands = async (msg: string, message: Message) => {
  const memberRoles = message?.guild?.roles.cache.filter(
    (r) =>
      r.name.toLowerCase().includes("meads") ||
      r.name.toLowerCase() === "beginner"
  );
  const ranks =
    memberRoles
      ?.map((r) => r.name)
      .sort((a: string, b: string): number => {
        const isNumericA = /^\d+/.test(a); // Check if `a` starts with a number
        const isNumericB = /^\d+/.test(b); // Check if `b` starts with a number

        if (isNumericA && isNumericB) {
          // Both start with numbers, compare them numerically
          const numA = parseInt(a.match(/^\d+/)![0], 10);
          const numB = parseInt(b.match(/^\d+/)![0], 10);
          return numA - numB;
        } else if (isNumericA) {
          // `a` is numeric but `b` is not, `b` comes first
          return 1;
        } else if (isNumericB) {
          // `b` is numeric but `a` is not, `a` comes first
          return -1;
        } else {
          // Neither are numeric, compare alphabetically
          return a.localeCompare(b);
        }
      }) || [];
  const rankString = ranks.reduce((acc, r) => `${acc}\n- ${r}`);

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
