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
import { handleCommands } from "./commands";
import { handleRecipeCommands } from "./recipes";
import { handleAbvCommands } from "./abvCommand";
import {
  autoMod,
  kickOrBanUser,
  listAdminCommands,
  registerVideo,
  sendBotMessage,
} from "./modCommands";
import { handleRoleCommands, rankCommand } from "./roles";
import { assignTempRole, checkRoles, getUserRoles } from "./tempUserRoles";

import cron from "node-cron";
import { handleHooligans } from "./bellyPickle";
import { handleVideos } from "./videos";
import avocadoImg from "./avocado";
import { dv10 } from "./writeToDv10";
import checkVideos from "./checkVideos";
import tagFunPants from "./tagFunpants";

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

cron.schedule("*/5 * * * *", async () => await checkVideos(client));

cron.schedule("0 * * * *", async () => {
  const randomChance = Math.random() * 30;
  if (randomChance <= 1) {
    tagFunPants(client);
  }
});

// testing code for funpants
// setInterval(async () => {
//   try {
//     await tagFunPants(client);
//   } catch (err) {
//     console.error("Error running tagFunPants on interval", err);
//   }
// }, 30000);

client.login(token);
client.once(Events.ClientReady, async (readyClient) => {
  await dbConnect();
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("messageCreate", async (message: Message) => {
  // early return if the message is sent by the bot

  if (message.author.bot) return;

  const adminTextChannel = client.channels.cache.get(
    adminChannel
  ) as TextChannel;

  const getTextChannel = (channel: string) =>
    client.channels.cache.get(channel) as TextChannel;

  const msg = message.content;
  const { member } = message;
  const msgEquals = (param: string) => msg.toLowerCase().startsWith(param);

  if (msgEquals(`<@${clientId}>`)) sendBotMessage(message, getTextChannel);

  // prevents @everyone
  const sketchy = autoMod(message);
  const autoModMsg = `
<@&713811216979591282>
User ${member?.user} has been flagged for suspicious activity. They have been timed out for 15min. 
Suspicious content can be viewed here ${message.url}`;

  if (sketchy) return adminTextChannel.send(autoModMsg);

  // admin only commands
  if (msgEquals("?registervideo")) return registerVideo(message);

  if (msgEquals("?kick") || msgEquals("?ban"))
    return kickOrBanUser(message, msg);

  if (msgEquals("!adminlist")) return listAdminCommands(message);
  handleHooligans(message);

  // unlisted commands
  if (msgEquals("!recipes")) handleRecipeCommands(msg, message);
  if (msgEquals("!video")) return handleVideos(msg, message);
  if (msgEquals("!abv")) return handleAbvCommands(msg, message);
  if (msgEquals("!flip"))
    return message.channel.send("🚫 No flips allowed! 🚫");
  if (msgEquals("!bakingsoda"))
    return message.channel.send("Baking soda is not a mead ingredient!!");
  if (msgEquals("!avocadohoney")) return message.channel.send(avocadoImg());
  if (msgEquals("!dv10")) return message.channel.send(await dv10());

  // listed commands
  if (msgEquals(rankCommand)) return handleRoleCommands(msg, message, member);
  return handleCommands(msg, message);
});

client.on("messageUpdate", (_, newMessage) => handleHooligans(newMessage));

client.on("guildMemberAdd", (member) => {
  assignTempRole(member);

  const channel = client.channels.cache.get(welcomeChannel) as TextChannel;

  const welcomeMessage = `Welcome to the MMM Discord Server <@${member.user.id}>!\n\n Please head over to <#${botSpamChannel}> and run **?rank (rank)** to receive a rank.\n\nHop on into <#${generalChannel}> channel and tell us what you're brewing or plan to brew!\n\nRun **!recipes** to get a list of popular MMM recipes.\n\nYou can find a list of all commands by running **!list**`;

  channel.send(welcomeMessage);
});
