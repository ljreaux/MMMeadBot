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
  welcomeChannel = "",
  botSpamChannel = "",
  generalChannel = "",
  adminChannel = ""
} = process.env;

import dbConnect from "./lib/db";
import { rankCommand, handleCommands } from "./commands";
import { handleRecipeCommands } from "./recipes";
import { handleAbvCommands } from "./abvCommand";
import { autoMod, kickOrBanUser } from "./modCommands";
import { handleRoleCommands } from "./roles";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

client.login(token);
client.once(Events.ClientReady, async (readyClient) => {
  await dbConnect();
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
const adminTextChannel = client.channels.cache.get(adminChannel) as TextChannel;

client.on("messageCreate", (message: Message) => {
  // early return if the message is sent by the bot
  if (message.author.bot) {
    return;
  }

  const msg = message.content;
  const { member } = message;
  const msgEquals = (param: string) => msg.toLowerCase().startsWith(param);

  autoMod(message, adminTextChannel)

  if (msgEquals("?kick") || msgEquals("?ban"))
    return kickOrBanUser(message, msg);

  if (msgEquals(rankCommand)) return handleRoleCommands(msg, message, member);

  if (msgEquals("!recipes")) handleRecipeCommands(msg, message);

  if (msgEquals("!abv")) return handleAbvCommands(msg, message);

  if (msgEquals("!flip")) {
    message.channel.send("🚫 No flips allowed! 🚫")
    return
  }
  if (msgEquals('!bakingsoda')) {
    message.channel.send('Baking soda is not a mead ingredient!!');
    return
  }

  return handleCommands(msg, message);
});

client.on("guildMemberAdd", (member) => {
  const channel = client.channels.cache.get(welcomeChannel) as TextChannel;
  channel.send(
    `Welcome to the MMM Discord Server <@${member.user.id}>!\n\n Please head over to <#${botSpamChannel}> and run **?rank (rank)** to receive a rank and join your mini mead making community.\n\nHop on into <#${generalChannel}> channel and tell us what you're brewing or plan to brew!\n\nRun **!recipes** to get a list of popular MMM recipes.\n\nYou can find a list of all commands by running **!list**`
  );
});
