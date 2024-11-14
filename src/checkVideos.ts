import { Client, EmbedBuilder, TextChannel } from "discord.js";
import Parser from "rss-parser";
import NewVideo from "./models/newVideo";
const parser = new Parser();
const { YOUTUBE_XML_URL, youtubeShenanigans, guildId } = process.env;
export default async function checkVideos(client: Client) {
  try {
    if (!YOUTUBE_XML_URL || !youtubeShenanigans || !guildId) throw new Error();
    const guild = await client.guilds.fetch(guildId);
    const channel = (await guild.channels.fetch(
      youtubeShenanigans
    )) as TextChannel;

    const data = await parser.parseURL(YOUTUBE_XML_URL);
    const [rawData] = await NewVideo.find().lean();
    const id = rawData?.video_id || "";
    const { id: mostRecentVideoId, title, link, author } = data.items[0];

    if (id !== mostRecentVideoId) {
      await NewVideo.deleteMany({});
      const newVideo = await NewVideo.create({
        created_at: new Date(),
        video_id: mostRecentVideoId,
      });
      const res = await newVideo.save();
      console.log("New video stored: ", res);
      const embed = new EmbedBuilder({
        title,
        url: link,
        timestamp: Date.now(),
        image: {
          url: `https://img.youtube.com/vi/${mostRecentVideoId.slice(
            9
          )}/maxresdefault.jpg`,
        },
        author: {
          name: author,
          iconURL:
            "https://yt3.googleusercontent.com/quhem18O3ZxjTxeHYD4B95wluihYXG5bmdUrY-dXD7-XrUwJUndGjpnys9H4lpA-W9Pzco51pkg=s160-c-k-c0x00ffffff-no-rj",
          url: "https://www.youtube.com/c/ManMadeMead/?sub_confirmation=1",
        },
        footer: {
          text: client.user?.tag || "",
          iconURL: client.user?.displayAvatarURL() || "",
        },
      });

      await channel?.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error("Error parsing RSS feed", error);
    return;
  }
}
