import { Client, EmbedBuilder, TextChannel } from "discord.js";
import Parser from "rss-parser";
import NewVideo from "../models/newVideo";

const parser = new Parser();
const { YOUTUBE_XML_URL, YOUTUBE_SHENANIGANS, GUILD_ID } = process.env;

// Helper to parse pubDate and check recency
function isRecent(pubDate: string, maxAgeMinutes = 60) {
  const publishedTime = new Date(pubDate).getTime();
  const now = Date.now();
  return now - publishedTime < maxAgeMinutes * 60 * 1000;
}

export default async function checkVideos(client: Client) {
  try {
    if (!YOUTUBE_XML_URL || !YOUTUBE_SHENANIGANS || !GUILD_ID)
      throw new Error();
    const guild = await client.guilds.fetch(GUILD_ID);
    const channel = (await guild.channels.fetch(
      YOUTUBE_SHENANIGANS
    )) as TextChannel;

    const data = await parser.parseURL(YOUTUBE_XML_URL);
    const latestItem = data.items[0];
    const { id: mostRecentVideoId, title, link, author, pubDate } = latestItem;

    const [lastPosted] = await NewVideo.find().lean();
    const lastVideoId = lastPosted?.video_id || "";

    // Avoid reposting or posting old videos
    if (mostRecentVideoId === lastVideoId || !isRecent(pubDate ?? "")) {
      return;
    }

    // Save new video
    await NewVideo.deleteMany({});
    await NewVideo.create({
      created_at: new Date(),
      video_id: mostRecentVideoId,
    });

    const embed = new EmbedBuilder({
      title,
      url: link,
      timestamp: Date.now(),
      image: {
        url: `https://img.youtube.com/vi/${mostRecentVideoId.slice(9)}/maxresdefault.jpg`,
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
    console.log("Posted new video:", mostRecentVideoId);
  } catch (error) {
    console.error("Error parsing RSS feed", error);
  }
}
