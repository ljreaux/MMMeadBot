import { Message } from "discord.js";
import Video from "./models/videos";
export interface RecipeType {
  name: string;
  link: string;
}

export const getVideos = async () => await Video.find();

export const handleVideos = async (message: Message) => {
  const videos = await getVideos();
  const msg = message.content;
  const [, video] = msg.split(" ");
  if (!video) return;

  const videoString = video?.toLowerCase() || "";
  const foundRecipe = videos.find(
    (vid: { command: string; response: string }) =>
      vid.command.includes(videoString)
  );

  if (foundRecipe) return message.channel.send(foundRecipe.response);
  else
    return message.channel.send(
      `The video ${video} is not a valid video command.`
    );
};
