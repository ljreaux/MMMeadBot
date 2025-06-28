import "./utils/groupByPolyfill"; // Import the polyfill
import {
  Client,
  Events,
  GatewayIntentBits,
  Message,
  TextChannel,
} from "discord.js";

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

import { handleRoleCommands, rankCommand } from "./roles";
import { assignTempRole, checkRoles, getUserRoles } from "./tempUserRoles";

import cron from "node-cron";
import { handleHooligans } from "./bellyPickle";
import checkVideos from "./checkVideos";
import tagFunPants from "./tagFunpants";
import { hiddenCommands } from "./utils/hiddenCommands";
import { autoMod, sendBotMessage } from "./modCommands";
import {
  dv10Url,
  fetchCloudinaryImages,
  shadowHiveUrl,
  writeToTextFile,
} from "./writeToDv10";

import { botherJake } from "./botherJake";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

const getTextChannel = (channel: string) =>
  client.channels.cache.get(channel) as TextChannel;

const adminTextChannel = getTextChannel(adminChannel);

cron.schedule("0 2 * * *", async () => {
  const roles = await getUserRoles();
  await checkRoles(roles, client);
});

cron.schedule("*/5 * * * *", async () => await checkVideos(client));

cron.schedule("0 * * * *", async () => {
  const randomChance = Math.random() * 50;
  if (randomChance <= 1) {
    tagFunPants(client);
  }
});

cron.schedule("0 0 * * 0", async () => {
  const images = await fetchCloudinaryImages(dv10Url);
  const shadowhiveImages = await fetchCloudinaryImages(shadowHiveUrl);
  await writeToTextFile(images, "images.txt");
  await writeToTextFile(shadowhiveImages, "shadowhive.txt");
  console.log("Image links saved successfully.");
});

cron.schedule(
  "0 15 */5 * *",
  () => {
    botherJake(client);
  },
  {
    timezone: "America/Chicago",
  }
);

client.login(token);
client.once(Events.ClientReady, async (readyClient) => {
  await dbConnect();
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  handleHooligans(message);

  const msg = message.content;
  const { member } = message;
  const msgEquals = (param: string) =>
    msg.toLowerCase().startsWith(param.toLowerCase());

  if (msgEquals(`<@${clientId}>`)) sendBotMessage(message);

  // prevents @everyone
  const sketchy = autoMod(message);
  const autoModMsg = `
<@&713811216979591282>
User ${member?.user} has been flagged for suspicious activity. They have been timed out for 15min. 
Suspicious content can be viewed here ${message.url}`;

  if (sketchy) return adminTextChannel.send(autoModMsg);

  hiddenCommands.forEach(({ command, func }) => {
    if (msgEquals(command)) return func(message);
  });

  // listed commands
  if (msgEquals(rankCommand) || msgEquals("!rank"))
    return handleRoleCommands(msg, message, member);
  return handleCommands(msg, message);
});

client.on("messageUpdate", (_, newMessage) => handleHooligans(newMessage));

client.on("guildMemberAdd", (member) => {
  assignTempRole(member);

  const channel = getTextChannel(welcomeChannel);

  const welcomeMessage = `Welcome to the MMM Discord Server <@${member.user.id}>!\n\n Please head over to <#${botSpamChannel}> and run **?rank** followed by one of the available ranks. To find a list run **!listranks**.\n\nHop on into <#${generalChannel}> channel and tell us what you're brewing or plan to brew!\n\nRun **!recipes** to get a list of popular MMM recipes.\n\nYou can find a list of all commands by running **!list**`;

  channel.send(welcomeMessage);
});
