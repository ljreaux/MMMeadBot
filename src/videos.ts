import { Message } from "discord.js";
import Video from "./models/videos";
import { CommandType } from "./commands";

export interface RecipeType {
  name: string;
  link: string;
}

export const getVideos = async () => await Video.find();

export const handleVideos = async (msg: string, message: Message) => {
  const videos = await getVideos();
  const [, recipe] = msg.split(" ");
  if (!recipe) return;
  const recipeString = recipe?.toLowerCase() || "";
  const foundRecipe = videos.find((r: { command: string; response: string }) =>
    r.command.includes(recipeString)
  );
  if (foundRecipe) {
    message.channel.send(foundRecipe.response);
    return;
  } else if (recipe) {
    message.channel.send(`The recipe ${recipe} is not a valid recipe command.`);
    return;
  }
};
