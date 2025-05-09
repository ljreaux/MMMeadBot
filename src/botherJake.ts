import { Client, TextChannel } from "discord.js";
const { botSpamChannel = "" } = process.env;

const JAKE_USER_ID = "206621541318918144";
const msgToJake = `<@${JAKE_USER_ID}>, shouldn't you be planting your berry bushes!?`;

export async function botherJake(client: Client) {
  const botChannel = client.channels.cache.get(botSpamChannel) as TextChannel;

  botChannel.send(msgToJake);
}
