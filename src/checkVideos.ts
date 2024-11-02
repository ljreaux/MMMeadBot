import { Client, EmbedBuilder, TextChannel } from "discord.js";
import fs from "fs";
import Parser from "rss-parser";
const parser = new Parser();
const { YOUTUBE_XML_URL, youtubeShenanigans, guildId } = process.env;
export default async function checkVideos(client: Client) {
  const jsonPath = "./recentVideo.json";
  try {
    if (!YOUTUBE_XML_URL || !youtubeShenanigans || !guildId) throw new Error();
    const guild = await client.guilds.fetch(guildId);
    const channel = (await guild.channels.fetch(
      youtubeShenanigans
    )) as TextChannel;

    const data = await parser.parseURL(YOUTUBE_XML_URL);
    const rawData = fs.readFileSync(jsonPath);
    const { id } = JSON.parse(rawData.toString());

    const { id: mostRecentVideoId, title, link, author } = data.items[0];

    if (id !== mostRecentVideoId) {
      fs.writeFileSync(jsonPath, JSON.stringify({ id: mostRecentVideoId }));
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
