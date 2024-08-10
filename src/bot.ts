import {
  Client,
  Events,
  GatewayIntentBits,
  Message,
  TextChannel,
} from "discord.js";

import dotenv from "dotenv";
dotenv.config();
const {
  token,
  clientId,
  welcomeChannel = "",
  botSpamChannel = "",
  generalChannel = "",
  adminChannel = "",
} = process.env;

import dbConnect from "./lib/db";
import { rankCommand, handleCommands } from "./commands";
import { handleRecipeCommands } from "./recipes";
import { handleAbvCommands } from "./abvCommand";
import { autoMod, kickOrBanUser, sendBotMessage } from "./modCommands";
import { handleRoleCommands } from "./roles";
import { assignTempRole, checkRoles, getUserRoles } from "./tempUserRoles";

import cron from "node-cron";
import { handleHooligans } from "./bellyPickle";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

cron.schedule("0 2 * * *", async () => {
  const roles = await getUserRoles();
  await checkRoles(roles, client);
});

client.login(token);
client.once(Events.ClientReady, async (readyClient) => {
  await dbConnect();
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("messageCreate", (message: Message) => {
  // early return if the message is sent by the bot
  if (message.author.bot) {
    return;
  }
  const adminTextChannel = client.channels.cache.get(
    adminChannel
  ) as TextChannel;

  const getTextChannel = (channel: string) =>
    client.channels.cache.get(channel) as TextChannel;

  const msg = message.content;
  const { member } = message;
  const msgEquals = (param: string) => msg.toLowerCase().startsWith(param);

  if (msgEquals(`<@${clientId}>`)) sendBotMessage(message, getTextChannel);

  const sketchy = autoMod(message, adminTextChannel);
  if (sketchy)
    adminTextChannel.send(`
<@&713811216979591282>
User ${member?.user} has been flagged for suspicious activity. They have been timed out for 15min. 
Suspicious content can be viewed here ${message.url}

    `);

  if (msgEquals("?kick") || msgEquals("?ban"))
    return kickOrBanUser(message, msg);

  handleHooligans(message);
  if (msgEquals(rankCommand)) return handleRoleCommands(msg, message, member);

  if (msgEquals("!recipes")) handleRecipeCommands(msg, message);

  if (msgEquals("!abv")) return handleAbvCommands(msg, message);

  if (msgEquals("!flip")) {
    message.channel.send("🚫 No flips allowed! 🚫");
    return;
  }
  if (msgEquals("!bakingsoda")) {
    message.channel.send("Baking soda is not a mead ingredient!!");
    return;
  }

  return handleCommands(msg, message);
});

client.on("messageUpdate", (_, newMessage) => {
  return handleHooligans(newMessage);
});

client.on("guildMemberAdd", (member) => {
  assignTempRole(member).then((user) => console.log(user));

  const channel = client.channels.cache.get(welcomeChannel) as TextChannel;
  channel.send(
    `Welcome to the MMM Discord Server <@${member.user.id}>!\n\n Please head over to <#${botSpamChannel}> and run **?rank (rank)** to receive a rank and join your mini mead making community.\n\nHop on into <#${generalChannel}> channel and tell us what you're brewing or plan to brew!\n\nRun **!recipes** to get a list of popular MMM recipes.\n\nYou can find a list of all commands by running **!list**`
  );
});
