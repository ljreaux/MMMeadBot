import {
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  Message,
  MessageFlags,
  PermissionFlagsBits,
  PermissionsBitField,
  TextChannel,
} from "discord.js";
import Video from "../models/videos.js";
import { Command } from "../commands/slashCommands.js";

const minutes = 15;

const sketchyPhrases: (string | RegExp)[] = ["@everyone", "@here"];

const isAdmin = (message: Message) => {
  return (
    message.member
      ?.permissionsIn((message.channel as TextChannel).id)
      .has(PermissionsBitField.Flags.Administrator) ||
    message.member
      ?.permissionsIn((message.channel as TextChannel).id)
      .has(PermissionsBitField.Flags.ModerateMembers)
  );
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

export const sendbotmessage: Command = {
  description: "Send a bot message to a chosen channel (admin only).",
  requiredPermissions: PermissionFlagsBits.Administrator,
  options: [
    {
      type: ApplicationCommandOptionType.Channel,
      name: "channel",
      description: "Where should I post?",
      required: true,
      // Limit to text channels + announcement channels + threads
      channel_types: [
        ChannelType.GuildText,
        ChannelType.GuildAnnouncement,
        ChannelType.AnnouncementThread,
        ChannelType.PublicThread,
        ChannelType.PrivateThread,
      ],
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "message",
      description: "What should I say?",
      required: true,
    },
  ] as const,
  fn: async (int: ChatInputCommandInteraction) => {
    if (!int.inGuild()) {
      await int.reply({
        content: "Guild only.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // defense in depth at runtime
    const member = await int.guild!.members.fetch(int.user.id);
    if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
      await int.reply({
        content: "Nice try, but you don't have the power.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const target = int.options.getChannel("channel", true);
    const content = int.options.getString("message", true);

    // Make sure target is text-postable and we have perms there
    // (SendMessages for channels, SendMessagesInThreads for threads)
    const me = await int.guild!.members.fetchMe();
    const perms = (target as any).permissionsFor?.(me) as
      | PermissionsBitField
      | undefined;

    const canSend =
      perms?.has(PermissionFlagsBits.SendMessages) ||
      perms?.has(PermissionFlagsBits.SendMessagesInThreads);

    // Some thread channels report only the thread flag; also ensure it's text-based
    const isTextBased =
      // discord.js channel objects have isTextBased()
      (typeof (target as any).isTextBased === "function" &&
        (target as any).isTextBased()) ||
      // fallback: threads/text types
      [
        ChannelType.GuildText,
        ChannelType.GuildAnnouncement,
        ChannelType.PublicThread,
        ChannelType.PrivateThread,
        ChannelType.AnnouncementThread,
      ].includes((target as any).type);

    if (!isTextBased || !canSend) {
      await int.reply({
        content:
          "I can’t send messages in that channel (wrong type or missing permissions).",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // Send the message
    await (target as any).send({ content }).catch(() => {});

    await int.reply({
      content: `Sent to <#${target.id}> ✅`,
      flags: MessageFlags.Ephemeral,
    });
  },
};

export const addVideo = async (post: { command: string; response: string }) => {
  const { command, response } = post;

  const newVideo = new Video({ command, response });
  const savedVideo = await newVideo.save();

  return {
    command: savedVideo.command,
    response: savedVideo.response,
    id: savedVideo._id.toString(),
  };
};
