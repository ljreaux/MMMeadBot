import { Channel, Message, PermissionsBitField, TextChannel } from "discord.js";
import Video from "./models/videos.js";
const minutes = 15;

export const kickOrBanUser = (message: Message, msg: string) => {
  const kickOrBan = msg.includes("kick") ? "kick" : "ban";
  if (!isAdmin(message)) {
    message.channel.send("Nice try, but you don't have the power");
    return;
  }
  let [, user] = msg.split(" ");
  if (!user) {
    message.channel.send(`You need to specify a user to ${kickOrBan}.`);
    return;
  }
  const userToKick = message.mentions.users.first();

  if (!userToKick) {
    message.channel.send("User not found.");
    return;
  }
  if (kickOrBan === "kick") {
    message.guild?.members.kick(userToKick);
  } else {
    message.guild?.members.ban(userToKick);
  }
  message.channel.send(`${userToKick.tag} has been ${kickOrBan}ed.`);
  return;
};

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

export const autoMod = (message: Message, channel: TextChannel) => {
  const msg = message.content;
  const { member } = message;
  let sketchy = false;
  sketchyPhrases.forEach((phrase) => {
    if (typeof phrase === "string") {
      if (msg.toLowerCase().includes(phrase) && !isAdmin(message)) {
        member?.timeout(minutes * 60 * 1000);
        sketchy = true;
      }
    } else {
      if (phrase.test(msg) && !isAdmin(message)) {
        member?.timeout(minutes * 60 * 1000);
        sketchy = true;
      }
    }
  });
  return sketchy;
};

export const sendBotMessage = async (
  message: Message,
  getChannel: (channel: string) => TextChannel
) => {
  if (!isAdmin(message)) {
    message.channel.send("Nice try, but you don't have the power");
    return;
  }

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
  if (!isAdmin(message)) {
    message.channel.send("Nice try, but you don't have the power");
    return;
  }

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
