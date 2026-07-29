import {
  EmbedBuilder,
  Message,
  PermissionFlagsBits,
  type GuildMember,
} from "discord.js";

export type HoneypotOptions = {
  channelId: string;
  adminChannelId: string;
  exemptRoleIds?: readonly string[];
};

type HoneypotAction =
  | { kind: "banned" }
  | { kind: "protected"; reason: string }
  | { kind: "failed"; reason: string };

const MAX_FIELD_LENGTH = 1_024;
const MAX_BAN_REASON_LENGTH = 512;

const truncate = (value: string, maxLength = MAX_FIELD_LENGTH) =>
  value.length <= maxLength
    ? value
    : `${value.slice(0, Math.max(0, maxLength - 1))}…`;

const discordTimestamp = (timestamp: number | null, fallback = "Unknown") => {
  if (timestamp === null) return fallback;
  const seconds = Math.floor(timestamp / 1_000);
  return `<t:${seconds}:F> (<t:${seconds}:R>)`;
};

const formatBytes = (bytes: number) => {
  if (bytes < 1_024) return `${bytes} B`;
  if (bytes < 1_024 ** 2) return `${(bytes / 1_024).toFixed(1)} KiB`;
  return `${(bytes / 1_024 ** 2).toFixed(1)} MiB`;
};

const getProtectionReason = (
  message: Message<true>,
  member: GuildMember,
  exemptRoleIds: ReadonlySet<string>
) => {
  if (member.id === message.guild.ownerId) return "server owner";

  const protectedPermissions = [
    PermissionFlagsBits.Administrator,
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.ModerateMembers,
  ];

  if (
    protectedPermissions.some((permission) =>
      member.permissions.has(permission)
    )
  ) {
    return "member has moderation permissions";
  }

  if (member.roles.cache.some((role) => exemptRoleIds.has(role.id))) {
    return "member has a configured exempt role";
  }

  return null;
};

const formatAttachments = (message: Message<true>) => {
  if (message.attachments.size === 0) return "None";

  return truncate(
    message.attachments
      .map((attachment) => {
        const details = [
          attachment.name ?? "unnamed file",
          formatBytes(attachment.size),
          attachment.contentType ?? "unknown type",
        ].join(" · ");
        return `[${details}](${attachment.url})`;
      })
      .join("\n"),
    700
  );
};

const formatStickers = (message: Message<true>) => {
  if (message.stickers.size === 0) return "None";
  return truncate(
    message.stickers
      .map((sticker) => `${sticker.name} (\`${sticker.id}\`)`)
      .join("\n"),
    300
  );
};

const formatRoles = (member: GuildMember) => {
  const roles = member.roles.cache
    .filter((role) => role.id !== member.guild.id)
    .sort((left, right) => right.position - left.position)
    .map((role) => `${role.name} (\`${role.id}\`)`);

  return roles.length === 0 ? "None" : truncate(roles.join("\n"), 700);
};

const getActionPresentation = (action: HoneypotAction) => {
  switch (action.kind) {
    case "banned":
      return {
        color: 0x2ecc71,
        title: "Honeypot triggered — member banned",
        result: "Banned successfully",
      };
    case "protected":
      return {
        color: 0xf1c40f,
        title: "Honeypot triggered — protected member",
        result: `Ban skipped: ${action.reason}`,
      };
    case "failed":
      return {
        color: 0xe74c3c,
        title: "Honeypot triggered — ban failed",
        result: `Ban failed: ${action.reason}`,
      };
  }
};

const buildIncidentEmbed = (
  message: Message<true>,
  member: GuildMember,
  action: HoneypotAction
) => {
  const presentation = getActionPresentation(action);
  const content = message.content.trim() || "(no text content)";
  const accountAgeDays = Math.floor(
    (message.createdTimestamp - message.author.createdTimestamp) / 86_400_000
  );
  const serverAgeDays = member.joinedTimestamp
    ? Math.floor(
        (message.createdTimestamp - member.joinedTimestamp) / 86_400_000
      )
    : null;

  return new EmbedBuilder()
    .setColor(presentation.color)
    .setTitle(presentation.title)
    .setThumbnail(message.author.displayAvatarURL())
    .setDescription(
      `A message was posted in the configured honeypot channel in **${message.guild.name}**.`
    )
    .addFields(
      {
        name: "Action",
        value: truncate(presentation.result),
        inline: false,
      },
      {
        name: "Member",
        value: truncate(
          [
            `${message.author.tag} / ${member.displayName}`,
            `User ID: \`${message.author.id}\``,
          ].join("\n")
        ),
        inline: true,
      },
      {
        name: "Location",
        value: truncate(
          [
            `<#${message.channelId}>`,
            `Channel ID: \`${message.channelId}\``,
            `Guild ID: \`${message.guildId}\``,
          ].join("\n")
        ),
        inline: true,
      },
      {
        name: "Account created",
        value: `${discordTimestamp(
          message.author.createdTimestamp
        )}\n${accountAgeDays} day(s) old at detection`,
        inline: false,
      },
      {
        name: "Joined server",
        value: `${discordTimestamp(member.joinedTimestamp)}${
          serverAgeDays === null
            ? ""
            : `\n${serverAgeDays} day(s) in the server at detection`
        }`,
        inline: false,
      },
      {
        name: "Message content",
        value: truncate(content),
        inline: false,
      },
      {
        name: "Attachments",
        value: formatAttachments(message),
        inline: false,
      },
      {
        name: "Stickers",
        value: formatStickers(message),
        inline: false,
      },
      {
        name: "Roles at detection",
        value: formatRoles(member),
        inline: false,
      },
      {
        name: "Incident identifiers",
        value: truncate(
          [
            `Message ID: \`${message.id}\``,
            `Detected: ${discordTimestamp(message.createdTimestamp)}`,
            `[Open original message](${message.url})`,
          ].join("\n")
        ),
        inline: false,
      }
    )
    .setFooter({ text: "Automated honeypot enforcement" })
    .setTimestamp(message.createdAt);
};

const sendIncidentReport = async (
  message: Message<true>,
  member: GuildMember,
  adminChannelId: string,
  action: HoneypotAction
) => {
  if (!adminChannelId) {
    console.error(
      `[honeypot] ADMIN_CHANNEL is not configured; incident ${message.id} could not be reported`
    );
    return;
  }

  try {
    const channel = await message.guild.channels.fetch(adminChannelId);
    if (!channel?.isTextBased() || !("send" in channel)) {
      throw new Error("ADMIN_CHANNEL is not a message-capable text channel");
    }

    await channel.send({
      embeds: [buildIncidentEmbed(message, member, action)],
      allowedMentions: { parse: [] },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    console.error(
      `[honeypot] Failed to report incident ${message.id}: ${reason}`
    );
  }
};

/**
 * Handles a MessageCreate event when it is posted in the configured honeypot.
 *
 * Returns true whenever the message belongs to the honeypot channel so the
 * caller can stop all other message processing.
 */
export const handleHoneypotMessage = async (
  message: Message,
  options: HoneypotOptions
) => {
  if (!options.channelId || message.channelId !== options.channelId) {
    return false;
  }

  if (!message.inGuild() || message.author.bot || message.webhookId) {
    return true;
  }

  let member: GuildMember;
  try {
    member =
      message.member ?? (await message.guild.members.fetch(message.author.id));
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    console.error(
      `[honeypot] Could not resolve member ${message.author.id} for incident ${message.id}: ${reason}`
    );
    return true;
  }

  const exemptRoleIds = new Set(options.exemptRoleIds ?? []);
  const protectionReason = getProtectionReason(message, member, exemptRoleIds);

  let action: HoneypotAction;
  if (protectionReason) {
    action = { kind: "protected", reason: protectionReason };
  } else if (!member.bannable) {
    action = {
      kind: "failed",
      reason: "the bot cannot ban this member; check role hierarchy and permissions",
    };
  } else {
    const banReason = truncate(
      `Honeypot channel post by ${message.author.tag} (${message.author.id}); message ${message.id}`,
      MAX_BAN_REASON_LENGTH
    );

    try {
      await member.ban({ reason: banReason });
      action = { kind: "banned" };
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown error";
      action = { kind: "failed", reason: truncate(reason, 900) };
    }
  }

  await sendIncidentReport(message, member, options.adminChannelId, action);
  console.log(
    `[honeypot] Incident ${message.id} for user ${message.author.id}: ${action.kind}`
  );
  return true;
};
