import { Message, PermissionsBitField, TextChannel } from "discord.js";
import Video from "./models/videos.js";
import {
  dv10Url,
  fetchCloudinaryImages,
  shadowHiveUrl,
  writeToTextFile,
} from "./writeToDv10.js";
const minutes = 15;

const sketchyPhrases: (string | RegExp)[] = ["@everyone", "@here"];

const isAdmin = (message: Message) => {
  return (
    message.member
      ?.permissionsIn(message.channel.id)
      .has(PermissionsBitField.Flags.Administrator) ||
    message.member
      ?.permissionsIn(message.channel.id)
      .has(PermissionsBitField.Flags.ModerateMembers)
  );
};

export const kickOrBanUser = (message: Message) => {
  const msg = message.content;
  const kickOrBan = msg.includes("kick") ? "kick" : "ban";
  if (!isAdmin(message))
    return message.channel.send("Nice try, but you don't have the power");

  let [, user] = msg.split(" ");
  if (!user)
    return message.channel.send(`You need to specify a user to ${kickOrBan}.`);

  const userToKick = message.mentions.users.first();

  if (!userToKick) return message.channel.send("User not found.");

  if (kickOrBan === "kick") message.guild?.members.kick(userToKick);
  else message.guild?.members.ban(userToKick);

  return message.channel.send(`${userToKick.tag} has been ${kickOrBan}ed.`);
};

export const autoMod = (message: Message) => {
  const msg = message.content.toLowerCase();
  const { member } = message;

  if (isAdmin(message)) return false;

  const isSketchy = (phrase: string | RegExp, msg: string) =>
    typeof phrase === "string" ? msg.includes(phrase) : phrase.test(msg);

  for (const phrase of sketchyPhrases) {
    const sketch = isSketchy(phrase, msg);

    if (sketch) {
      member?.timeout(minutes * 60 * 1000);
      return sketch;
    }
  }
  return false;
};

export const sendBotMessage = async (message: Message) => {
  if (!isAdmin(message))
    return message.channel.send("Nice try, but you don't have the power");

  const getChannel = (channel: string) =>
    message.client.channels.cache.get(channel) as TextChannel;
  const [, channel, ...msgArr] = message.content.split(/[ ,]+/);
  const channelId = channel.slice(2, channel.length - 1);
  const cnl = getChannel(channelId);
  const msg = msgArr.join(" ").trim();

  if (cnl) cnl.send(msg);
};

const addVideo = async (post: { command: string; response: string }) => {
  const { command, response } = post;

  const newVideo = new Video({ command, response });
  const savedVideo = await newVideo.save();

  return {
    command: savedVideo.command,
    response: savedVideo.response,
    id: savedVideo._id.toString(),
  };
};

export const registerVideo = async (message: Message) => {
  if (!isAdmin(message))
    return message.channel.send("Nice try, but you don't have the power");

  const [, videoCom] = message.content.split(" ");
  const newVid = message.attachments.first();

  if (!newVid || !videoCom)
    return message.channel.send(
      "Please provide a video attachment and command name."
    );

  const videoUrl = newVid.url;
  const videoCommand = `!video ${videoCom}`;

  const newVideo = await addVideo({
    command: videoCommand,
    response: videoUrl,
  });

  if (newVideo)
    return message.channel.send(`${videoCom} has been successfully added.`);

  return message.channel.send("Something went wrong.");
};

export const refreshDv10 = async (message: Message) => {
  if (!isAdmin(message))
    return message.channel.send("Nice try, but you don't have the power");
  const images = await fetchCloudinaryImages(dv10Url);
  await writeToTextFile(images, "images.txt");
  return message.channel.send("DV10 file has been refreshed.");
};

export const refreshShadowHive = async (message: Message) => {
  if (!isAdmin(message))
    return message.channel.send("Nice try, but you don't have the power");
  const images = await fetchCloudinaryImages(shadowHiveUrl);
  await writeToTextFile(images, "shadowhive.txt");
  return message.channel.send("Shadowhive file has been refreshed.");
};

export const listAdminCommands = (message: Message) => {
  if (!isAdmin(message)) return;

  return message.channel.send(`Here are all the admin commands:
1. ?kick \`@user\`
2. ?ban \`@user\`
3. ?registerVideo \`video name\` (attach video to message)
4. To send a message from the bot, enter the following separated by spaces:
  - \`@MMMeadBot\`
  - \`#channel-name\`
  - Your Message
5. To add new commands visit the [admin dashboard.](https://mmmeadbot-admin-dashboard.vercel.app/)
6. To refresh the DV10 file, use the command:
  - \`!refreshDv10\`
   `);
};
