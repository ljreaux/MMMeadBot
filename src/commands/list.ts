import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
} from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { buildCommandRegistry } from "./slashCommands";

const registryPromise = buildCommandRegistry();

const MAX = 1900;

function chunkLines(header: string, lines: string[]): string[] {
  const chunks: string[] = [];
  let buf = header ? `${header}\n` : "";

  for (const line of lines) {
    if (buf.length + line.length + 1 > MAX) {
      chunks.push(buf);
      buf = "";
    }
    buf += (buf ? "\n" : "") + line;
  }
  if (buf) chunks.push(buf);
  return chunks;
}

async function replyChunked(
  int: ChatInputCommandInteraction,
  header: string,
  lines: string[]
) {
  const chunks = chunkLines(header, lines);
  await int.reply({ content: chunks[0], flags: MessageFlags.Ephemeral });
  for (let i = 1; i < chunks.length; i++) {
    await int.followUp({ content: chunks[i], flags: MessageFlags.Ephemeral });
  }
}

async function sendCommandList(
  int: ChatInputCommandInteraction,
  { adminOnly }: { adminOnly: boolean }
) {
  const { commandMap } = await registryPromise;
  const q = (int.options.getString("query") ?? "").toLowerCase();

  const member = int.inGuild()
    ? await int.guild!.members.fetch(int.user.id)
    : null;

  const visible: Array<{ name: string; description: string }> = [];

  for (const [name, cmd] of Object.entries(commandMap)) {
    if (q && !name.includes(q)) continue;

    const isAdminCmd = Boolean(cmd.requiredPermissions);

    if (adminOnly) {
      if (!isAdminCmd) continue;
      if (!member?.permissions.has(PermissionFlagsBits.Administrator)) continue;
    } else {
      if (isAdminCmd) continue;
    }

    visible.push({ name, description: cmd.description });
  }

  if (!visible.length) {
    await int.reply({
      content: q
        ? `No ${adminOnly ? "admin" : "public"} commands match \`${q}\`.`
        : `No ${adminOnly ? "admin" : "public"} commands available.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const lines = visible
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ name, description }) => `\`/${name}\` — ${description}`);

  await replyChunked(
    int,
    `**${adminOnly ? "Admin-only" : "Available"} commands:**`,
    lines
  );
}

// Public list command
export const list = {
  description: "List available public slash commands.",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "query",
      description: "Filter by name (optional)",
      required: false,
    },
  ] as const,
  fn: (int: ChatInputCommandInteraction) =>
    sendCommandList(int, { adminOnly: false }),
};

// Admin list command
export const listadmin = {
  description: "List admin-only slash commands.",
  requiredPermissions: PermissionFlagsBits.Administrator,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "query",
      description: "Filter by name (optional)",
      required: false,
    },
  ] as const,
  fn: (int: ChatInputCommandInteraction) =>
    sendCommandList(int, { adminOnly: true }),
};
