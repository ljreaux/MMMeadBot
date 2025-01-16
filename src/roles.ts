import { Message, TextChannel } from "discord.js";

export const rankCommand = "?rank ";
const RANK_CHANNEL = "1322772543962349670";

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

export const isUnauthorized = (rank: string) => {
  for (const item of protectedRoles) {
    if (item.toLowerCase().startsWith(rank.toLowerCase())) {
      return true;
    }
  }
  return false;
};

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

// Beginner message
const beginnerMessage =
  "Welcome to the world of mead-making! Start your journey with your first brew!";

// Fallback message
const fallbackMessage =
  "Keep brewing! Every batch is a step closer to mastery!";

export const handleRoleCommands = async (
  msg: string,
  message: Message,
  member: Message["member"]
) => {
  // gets members current roles
  const memberRoles = member?.roles.cache.filter(
    (r) =>
      r.name.toLowerCase().includes("meads") ||
      r.name.toLowerCase() === "beginner"
  );

  // requested role (strip command and normalize input)
  let rank = msg.substring(rankCommand.length).trim();

  // Block attempts to ping @everyone, @here, or other roles
  if (
    rank.toLowerCase().includes("every") ||
    rank.toLowerCase().includes("@")
  ) {
    return message.channel.send(`Nice try. No ping for you.`);
  }
  // Check for unauthorized roles first
  if (isUnauthorized(rank)) {
    return message.channel.send(
      `You are in this discord server, but we do not grant you the rank of ${rank}`
    );
  }

  // Special handling for "beginner" rank
  if (rank.toLowerCase() === "beginner") {
    const beginnerRole = message.guild?.roles.cache.find(
      (r) => r.name.toLowerCase() === "beginner"
    );
    if (!beginnerRole) {
      return message.channel.send(`The role "Beginner" is not available.`);
    }

    // Remove other mead-related roles
    memberRoles?.forEach((r) => member?.roles.remove(r.id));

    member?.roles.add(beginnerRole.id);

    const rank_up = message.guild?.channels.cache.get(
      RANK_CHANNEL
    ) as TextChannel;

    rank_up
      ?.send(`${message.author.toString()} ${beginnerMessage}`)
      .catch((error) => console.error(error));

    return message.channel
      .send(`You have been assigned to the "Beginner" role.`)
      .catch((error) => console.error(error));
  }

  // Normalize numeric rank input (e.g., "10 meads" or "10 Mead")
  rank = rank.replace(/meads?/i, "").trim();

  // Extract numeric rank
  const numericRank = parseInt(rank, 10);

  if (isNaN(numericRank)) {
    return message.channel.send(
      `The rank "${rank}" is not a valid format (e.g., "10" or "10 meads").`
    );
  }

  // Look for the exact role by matching the numeric part
  const role = message.guild?.roles.cache.find((r) => {
    // Extract the numeric part of the role name for comparison
    const roleNumericMatch = r.name.match(/^(\d+)\s*Meads?$/i);
    const roleNumeric = roleNumericMatch
      ? parseInt(roleNumericMatch[1], 10)
      : null;

    // Check for an exact numeric match
    return roleNumeric === numericRank;
  });

  if (!role) {
    return message.channel.send(`The role "${rank}" is not a valid role.`);
  }

  // Remove other mead-related roles
  memberRoles?.forEach((r) => member?.roles.remove(r.id));

  member?.roles.add(role.id);

  const rank_up = message.guild?.channels.cache.get(
    RANK_CHANNEL
  ) as TextChannel;

  let rankUpMessage = rankUpMessages[numericRank];

  // Fallback message if rankUpMessage is undefined
  if (!rankUpMessage) {
    rankUpMessage = fallbackMessage;
  }

  // Send rank-up message
  rank_up
    ?.send(`${message.author.toString()} ${rankUpMessage}`)
    .catch((error) => console.error(error));

  return message.channel
    .send(`You have been assigned to role "${role.name}"`)
    .catch((error) => console.error(error));
};
