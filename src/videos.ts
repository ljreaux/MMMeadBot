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
  const [, video] = msg.split(" ");
  if (!video) return;
  const videoString = video?.toLowerCase() || "";
  const foundRecipe = videos.find(
    (vid: { command: string; response: string }) =>
      vid.command.includes(videoString)
  );
  if (foundRecipe) {
    message.channel.send(foundRecipe.response);
    return;
  } else if (video) {
    message.channel.send(`The video ${video} is not a valid video command.`);
    return;
  }
};
