import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  MessageFlags,
  TextChannel,
  AttachmentBuilder,
} from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { addVideo } from "../admin/modCommands";
import { Command } from "./slashCommands";
import { reloadCommands } from "../utils/reloadCommands";

const { STORAGE_CHANNEL_ID = "" } = process.env;

const sanitize = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .slice(0, 32);

export const registervideo: Command = {
  description: "Register a video command (admin only).",
  requiredPermissions: PermissionFlagsBits.Administrator,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "name",
      description: "Command name (e.g., taste, delaware)",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Attachment,
      name: "video",
      description: "Attach the video file",
      required: true,
    },
  ] as const,
  fn: async (int: ChatInputCommandInteraction) => {
    if (!int.inGuild()) {
      int.reply({
        content: "Guild only.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const me = await int.guild!.members.fetchMe();
    if (!me.permissions.has(PermissionFlagsBits.Administrator)) {
      int.reply({
        content: "Nice try, but you don't have the power.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const name = sanitize(int.options.getString("name", true));
    const att = int.options.getAttachment("video", true);

    // Download the attachment, then re-upload into storage channel
    try {
      const res = await fetch(att.url);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const file = new AttachmentBuilder(buf, {
        name: att.name ?? "video.mp4",
      });

      const storage = (await int.guild!.channels.fetch(
        STORAGE_CHANNEL_ID
      )) as TextChannel;
      const storageMsg = await storage.send({
        files: [file],
        content: `video: ${name}`,
      });

      const storedUrl = storageMsg.attachments.first()?.url;
      if (!storedUrl) throw new Error("No stored URL from storage message");

      // Save legacy-style command + durable URL
      await addVideo({ command: `!video ${name}`, response: storedUrl });

      await int.reply({
        content: `\`${name}\` has been saved.`,
        flags: MessageFlags.Ephemeral,
      });

      await reloadCommands();
    } catch (e) {
      console.error(e);
      await int.reply({
        content: "Failed to save video.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
