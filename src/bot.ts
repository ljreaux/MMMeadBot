import {
  Client,
  Events,
  GatewayIntentBits,
  Message,
  TextChannel,
} from "discord.js";
import cron from "node-cron";
import dbConnect from "./lib/db";
import { buildCommandRegistry, safeReply } from "./commands/slashCommands";

import {
  assignTempRole,
  checkRoles,
  getUserRoles,
} from "./admin/tempUserRoles";
import { handleHooligans } from "./utils/bellyPickle";
import checkVideos from "./utils/checkVideos";
import tagFunPants from "./utils/tagFunpants";
import { autoMod } from "./admin/modCommands";
import {
  dv10Url,
  fetchCloudinaryImages,
  shadowHiveUrl,
  writeToTextFile,
} from "./utils/writeToDv10";
import { reloadCommands } from "./utils/reloadCommands";
import { yeastInfoAutocomplete } from "./commands/yeastInfo";

const {
  TOKEN,
  WELCOME_CHANNEL = "",
  BOT_SPAM_CHANNEL = "",
  GENERAL_CHANNEL = "",
  ADMIN_CHANNEL = "",
} = process.env;

// Build slash command registry on startup
const registryPromise = buildCommandRegistry();

const getTextChannel = (channel: string) =>
  client.channels.cache.get(channel) as TextChannel;
// discord client handlings
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

client.login(TOKEN);

client.once(Events.ClientReady, async (readyClient) => {
  await dbConnect();
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  await reloadCommands();
});

client.on(Events.MessageCreate, async (message: Message) => {
  if (message.author.bot) return;

  handleHooligans(message);
  // prevents @everyone
  const sketchy = autoMod(message);

  const { member } = message;
  const autoModMsg = `
<@&713811216979591282>
User ${member?.user} has been flagged for suspicious activity. They have been timed out for 15min. 
Suspicious content can be viewed here ${message.url}`;
  const adminTextChannel = getTextChannel(ADMIN_CHANNEL);

  if (sketchy) return adminTextChannel.send(autoModMsg);
});

client.on(Events.MessageUpdate, (_, newMessage) => handleHooligans(newMessage));

client.on(Events.GuildMemberAdd, (member) => {
  assignTempRole(member);

  const channel = getTextChannel(WELCOME_CHANNEL);

  const welcomeMessage = `Welcome to the MMM Discord Server <@${member.user.id}>!\n\n Please head over to <#${BOT_SPAM_CHANNEL}> and run \`/rank\`.\n\nHop on into <#${GENERAL_CHANNEL}> channel and tell us what you're brewing or plan to brew!\n\nRun \`/recipes\` to get one of MMM's recipes.\n\nYou can find a list of all commands by running \`/list\``;

  channel.send(welcomeMessage);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isAutocomplete() && interaction.commandName === "yeastinfo") {
    return yeastInfoAutocomplete(interaction);
  }
  if (!interaction.isChatInputCommand()) return;

  // get cached registry
  const { commandMap } = await registryPromise;

  const cmd = commandMap[interaction.commandName];
  if (!cmd) {
    await safeReply(interaction, "Unknown command.");
    return;
  }

  // Permission gate (if set)
  if (cmd.requiredPermissions) {
    if (!interaction.inGuild()) {
      await safeReply(
        interaction,
        "This command can only be used in a server."
      );
      return;
    }
    const member = await interaction.guild!.members.fetch(interaction.user.id);
    if (!member.permissions.has(cmd.requiredPermissions)) {
      await safeReply(
        interaction,
        "You don’t have permission to use this command."
      );
      return;
    }
  }

  try {
    await cmd.fn(interaction);
  } catch (err) {
    console.error(err);
    await safeReply(interaction, "There was an error executing this command.");
  }
});

// scheduled events

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
