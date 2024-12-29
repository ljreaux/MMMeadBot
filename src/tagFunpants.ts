import { Client, TextChannel, ChannelType, PermissionsBitField } from "discord.js";
const { guildId } = process.env;

export default async function tagFunPants(client: Client) {
  const FUNPANTS = "251250155960008704";
  const STYNGER = "434942205426401322";
  const carlosVid =
    " https://res.cloudinary.com/devhg2clt/video/upload/v1734387048/1734386607_1734386559268_80482C2B5BB4131734386559_by9g3y.mp4";

  try {
    if (!guildId) throw new Error("Missing guildId in environment variables.");

    // Fetch the guild
    const guild = await client.guilds.fetch(guildId);

    // Fetch all channels in the guild
    const channels = await guild.channels.fetch();

    // Filter for standard text channels where both users have access and the bot can send messages
    const accessibleChannels = channels.filter((channel) => {
      if (channel?.type !== ChannelType.GuildText) return false; // Ensure it's a text channel
      const botPermissions = channel?.permissionsFor(guild.members.me!);
      const funPantsPermissions = channel?.permissionsFor(FUNPANTS);
      const styngerPermissions = channel?.permissionsFor(STYNGER);

      // Check if the bot and both users have permission to view and send messages in the channel
      return (
        botPermissions?.has(PermissionsBitField.Flags.SendMessages) &&
        funPantsPermissions?.has(PermissionsBitField.Flags.ViewChannel) &&
        styngerPermissions?.has(PermissionsBitField.Flags.ViewChannel)
      );
    });

    console.log(accessibleChannels.map((channel) => channel?.name));

    if (!accessibleChannels.size) {
      throw new Error("No suitable text channels available.");
    }

    // Select a random channel from the filtered list
    const randomChannel = accessibleChannels.random() as TextChannel;

    const randomNum = Math.random();

    // Determine whether to tag FUNPANTS or STYNGER (75% for FUNPANTS, 25% for STYNGER)
    const tagUserId = randomNum < 0.25 ? STYNGER : FUNPANTS;

    let msg = `Hi, <@${tagUserId}>`;
    if (randomNum > 0.75) msg += carlosVid;

    // Send a message in the selected random channel
    await randomChannel.send(msg);
  } catch (err) {
    console.error("Error selecting or sending to a random channel", err);
    return;
  }
}