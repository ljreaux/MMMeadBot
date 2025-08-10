import { REST, Routes } from "discord.js";
import { buildCommandRegistry } from "../commands/slashCommands";
const { TOKEN = "", APPLICATION_ID = "" } = process.env;

export const reloadCommands = async () => {
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    console.log("Started refreshing application (/) commands.");

    const { commands } = await buildCommandRegistry();

    await rest.put(Routes.applicationCommands(APPLICATION_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};
