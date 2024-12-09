import { Client, TextChannel } from "discord.js";
const { YOUTUBE_XML_URL, botSpamChannel, guildId } = process.env;
export default async function tagFunPants(client: Client) {
  const FUNPANTS = "251250155960008704";
  try {
    if (!YOUTUBE_XML_URL || !botSpamChannel || !guildId) throw new Error();
    const guild = await client.guilds.fetch(guildId);
    const channel = (await guild.channels.fetch(botSpamChannel)) as TextChannel;

    channel.send(`Hi, <@${FUNPANTS}>`);
  } catch (err) {
    console.error("Error fetching channel", err);
    return;
  }
}
