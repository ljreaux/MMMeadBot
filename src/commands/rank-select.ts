// rank.select.ts
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextChannel,
  MessageFlags,
  ButtonComponent,
} from "discord.js";

const { RANK_CHANNEL = "" } = process.env;

const protectedRoles = [
  "@everyone",
  "Everyone",
  "@Everyone",
  "everyone",
  "Administrator",
  "Moderator",
  "Mazer of the Week",
  "Patreon Bot",
  "Discord Mead Leader",
  "MMM Patron",
  "Mead Bot",
  "Rhythm",
  "Server Booster",
  "EasyPoll",
  "Live Countdown Bot",
  "YouTube Member",
  "technician",
  "YouTube",
  "YT Bot",
  "UMM2024",
  "UMM 2024 Purgatory Member",
  "Commercial",
];

const isUnauthorized = (rank: string) =>
  protectedRoles.some((n) => n.toLowerCase().startsWith(rank.toLowerCase()));

// Rank-up messages
const rankUpMessages: Record<number, string> = {
  10: "Whew, you’re on fire! Congratulations on your 10th mead!",
  20: "Congratulations on your 20th mead! What was it?",
  30: "You’ve made it to 30 meads. Have you made the same mead twice yet?",
  40: "40 meads, that’s impressive! Which batch has been your favorite so far?",
  50: "Halfway to 100! Congrats on your 50th mead! Any plans for a celebratory brew?",
  60: "60 meads? You’re practically a mead master at this point! What have you learned along the way?",
  70: "70 meads, wow! You’re truly hitting your stride. Have you ventured into any new flavors or techniques?",
  80: "80 meads! Are you experimenting more with ingredients now, or are you perfecting your go-to recipe?",
  90: "90 meads and still going strong! Do you feel like you’ve found your signature flavor yet?",
  100: "100 meads, what an accomplishment! Celebrate with something extra special. What’s next?",
  125: "125 meads, that’s incredible! How have your brewing skills evolved over time?",
  150: "150 meads—wow! You’ve officially entered the legendary ranks. What’s the most memorable batch so far?",
  175: "175 meads! Have you started sharing your knowledge with others yet, or keeping it all to yourself?",
  200: "200 meads! That’s a serious milestone! What do you consider your greatest brewing achievement?",
  225: "225 meads, that’s amazing! Are you starting to experiment with aging techniques or larger batches?",
  250: "250 meads, you’re a true mead-making pro! What new challenges are you setting for yourself?",
  275: "275 meads! You’re practically a mead-making institution by now! Any plans for collaborations or competitions?",
  300: "300 meads—what an accomplishment! Are you thinking about branching into commercial production?",
  325: "325 meads! That’s dedication. What’s your strategy for keeping things fresh and exciting with every batch?",
  350: "350 meads—so impressive! Have you started documenting your brews in a more formal way, like a mead book or blog?",
  375: "375 meads! You’re truly a mead-making legend. Do you have a personal favorite recipe that you keep coming back to?",
  400: "400 meads! A monumental achievement. Do you feel like you've mastered the craft, or is there still more to learn?",
  425: "425 meads, wow! What’s your next big goal in your mead-making journey?",
  450: "450 meads! Absolutely incredible. Are you planning any big celebrations or milestones for the 500 mark?",
};
const jokeRanks: Record<number, string> = {
  69: "Nice\n||Still not a valid role though.||",
  420: "Nice try. This isn’t *that* kind of server.",
};
const beginnerMessage =
  "Welcome to the world of mead-making! Start your journey with your first brew!";
const fallbackMessage =
  "Keep brewing! Every batch is a step closer to mastery!";

// --- helpers ---
const announceRankUp = async (
  int: ChatInputCommandInteraction,
  content: string
) => {
  if (!int.inGuild()) return;
  const chan = int.guild!.channels.cache.get(RANK_CHANNEL) as
    | TextChannel
    | undefined;

  await chan?.send(`${int.user.toString()} ${content}`).catch(() => {});
};

const extractNumeric = (name: string) => {
  const m = name.match(/^(\d+)\s*Meads?$/i);
  return m ? parseInt(m[1], 10) : undefined;
};

const getSelfAssignableRanks = async (int: ChatInputCommandInteraction) => {
  const roles = await int.guild!.roles.fetch();
  const items = roles
    .filter((r) => !!r) // type guard
    .map((r) => r!)
    .filter(
      (r) =>
        r.name.toLowerCase() === "beginner" ||
        extractNumeric(r.name) !== undefined
    )
    .filter((r) => !isUnauthorized(r.name) && r.editable); // skip protected/uneditable
  // sort: Beginner first, then numeric ascending
  const beginner = items.filter((r) => r.name.toLowerCase() === "beginner");
  const numeric = items
    .filter((r) => r.name.toLowerCase() !== "beginner")
    .sort((a, b) => extractNumeric(a.name)! - extractNumeric(b.name)!);
  return [...beginner, ...numeric];
};

const chunk = <T>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

// --- core apply logic you already had, adapted ---
const applyRank = async (int: ChatInputCommandInteraction, roleId: string) => {
  const guild = int.guild!;
  const member = await guild.members.fetch(int.user.id);
  const role = await guild.roles.fetch(roleId);
  if (!role) {
    await int.followUp({
      content: "Role not found.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  if (!role.editable) {
    await int.followUp({
      content: `I can’t edit "${role.name}" (role position).`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // remove other mead-related roles
  const toRemove = member.roles.cache.filter(
    (r) =>
      r.name.toLowerCase().includes("meads") ||
      r.name.toLowerCase() === "beginner"
  );
  for (const r of toRemove.values()) {
    await member.roles.remove(r).catch(() => {});
  }

  await member.roles.add(role).catch(() => {});

  // announce
  if (role.name.toLowerCase() === "beginner") {
    await announceRankUp(int, beginnerMessage);
  } else {
    const n = extractNumeric(role.name);
    const msg = (n && rankUpMessages[n]) || fallbackMessage;
    await announceRankUp(int, msg);
  }

  await int.followUp({
    content: `You’ve been assigned **${role.name}** ✅`,
    flags: MessageFlags.Ephemeral,
  });
};

export const rank = {
  description: "Choose your mead rank from a list.",
  options: [] as const,
  fn: async (int: ChatInputCommandInteraction) => {
    if (!int.inGuild()) {
      await int.reply({
        content: "This command only works in a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const me = await int.guild!.members.fetchMe();
    if (!me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await int.reply({
        content: "I need **Manage Roles** permission.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const roles = await getSelfAssignableRanks(int);
    if (roles.length === 0) {
      await int.reply({
        content: "No self-assignable ranks are configured.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // paginate into pages of 25
    const pages = chunk(roles, 25);
    let page = 0;

    const buildRow = () => {
      const opts = pages[page].map((r) =>
        new StringSelectMenuOptionBuilder().setLabel(r.name).setValue(r.id)
      );
      const select = new StringSelectMenuBuilder()
        .setCustomId("rank-select")
        .setPlaceholder("Select your rank…")
        .setMinValues(1)
        .setMaxValues(1)
        .setOptions(opts);

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        select
      );
      const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("prev")
          .setLabel("Prev")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 0),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === pages.length - 1)
      );
      return { row, buttons };
    };

    // build once
    let { row, buttons } = buildRow();

    await int.reply({
      content: "Pick your rank:",
      flags: MessageFlags.Ephemeral,
      components: [row, buttons],
    });

    const msg = await int.fetchReply();

    // Collector for the select menu
    const selectCollector = msg.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 60_000,
      filter: (i) => i.user.id === int.user.id && i.customId === "rank-select",
    });

    // Collector for the buttons
    const buttonCollector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000,
      filter: (i) =>
        i.user.id === int.user.id &&
        (i.customId === "prev" || i.customId === "next"),
    });

    selectCollector.on("collect", async (i) => {
      await i.deferUpdate();
      const [roleId] = i.values;
      await applyRank(int, roleId);
      selectCollector.stop("done");
      buttonCollector.stop("done");
    });

    buttonCollector.on("collect", async (i) => {
      if (i.customId === "prev" && page > 0) page -= 1;
      if (i.customId === "next" && page < pages.length - 1) page += 1;

      // rebuild current page rows and update
      ({ row, buttons } = buildRow());
      await i.update({ components: [row, buttons] });
    });

    const end = async () => {
      // disable controls
      const disabledSelectRow =
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          StringSelectMenuBuilder.from(
            row.components[0] as StringSelectMenuBuilder
          ).setDisabled(true)
        );
      const disabledButtonsRow =
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          //@ts-ignore
          ...(buttons.components as ButtonComponent[]).map((c) =>
            ButtonBuilder.from(c as any).setDisabled(true)
          )
        );

      await int
        .editReply({ components: [disabledSelectRow, disabledButtonsRow] })
        .catch(() => {});
    };

    selectCollector.on("end", end);
    buttonCollector.on("end", end);
  },
};
