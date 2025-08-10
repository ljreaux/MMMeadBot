import { Client, TextChannel } from "discord.js";
const { GUILD_ID } = process.env;

export default async function tagFunPants(client: Client) {
  const FUNPANTS = "251250155960008704";
  const STYNGER = "434942205426401322";
  const carlosVid =
    " https://res.cloudinary.com/devhg2clt/video/upload/v1734387048/1734386607_1734386559268_80482C2B5BB4131734386559_by9g3y.mp4";

  const { BOT_SPAM_CHANNEL = "" } = process.env;

  try {
    if (!GUILD_ID)
      throw new Error("Missing GUILD_ID in environment variables.");

    // Select a random channel from the filtered list
    const botSpam = client.channels.cache.get(BOT_SPAM_CHANNEL) as TextChannel;

    // accessibleChannels.random() as TextChannel;

    const randomNum = Math.random();

    // Determine whether to tag FUNPANTS or STYNGER (75% for FUNPANTS, 25% for STYNGER)
    const tagUserId = randomNum < 0.25 ? STYNGER : FUNPANTS;

    let msg = `Hi, <@${tagUserId}>`;
    if (randomNum > 0.75) msg += carlosVid;

    // Send a message in the selected random channel
    await botSpam.send(msg);
  } catch (err) {
    console.error("Error selecting or sending to a random channel", err);
    return;
  }
}
