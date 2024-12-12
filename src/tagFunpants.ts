import { Client, TextChannel, ChannelType } from "discord.js";
const { guildId } = process.env;

export default async function tagFunPants(client: Client) {
  const FUNPANTS = "251250155960008704";
  const STYNGER = "434942205426401322";

  try {
    if (!guildId) throw new Error("Missing guildId in environment variables.");

    // Fetch the guild
    const guild = await client.guilds.fetch(guildId);

    // Fetch all channels in the guild
    const channels = await guild.channels.fetch();

    // Filter for standard text channels where the bot can send messages
    const textChannels = channels.filter(
      (channel) =>
        channel?.type === ChannelType.GuildText && // Standard text channels only
        channel?.permissionsFor(guild.members.me!)?.has("SendMessages") // Bot has permission to send messages
    );

    console.log(textChannels.map((channel) => channel?.name));

    if (!textChannels.size) {
      throw new Error("No suitable text channels available.");
    }

    // Select a random channel from the filtered list
    const randomChannel = textChannels.random() as TextChannel;

    // Determine whether to tag FUNPANTS or STYNGER (75% for FUNPANTS, 25% for STYNGER)
    const tagUserId = Math.random() < 0.25 ? STYNGER : FUNPANTS;

    // Send a message in the selected random channel
    await randomChannel.send(`Hi, <@${tagUserId}>`);
  } catch (err) {
    console.error("Error selecting or sending to a random channel", err);
    return;
  }
}
