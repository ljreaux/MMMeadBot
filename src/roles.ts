import { Message } from "discord.js";
export const rankCommand = "?rank ";
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
    if (item.toLowerCase().includes(rank.toLowerCase())) {
      return true;
    }
  }
  return false;
};

export const handleRoleCommands = (
  msg: string,
  message: Message,
  member: Message["member"]
) => {
  // gets members current roles
  const memberRoles = member?.roles.cache.filter(
    (r) =>
      r.name.toLowerCase().includes("mead") ||
      r.name.toLowerCase() === "beginner"
  );
  // requested role
  let rank = msg.substring(rankCommand.length);

  if (rank.toLowerCase().includes("every") || rank.toLowerCase().includes("@"))
    return message.channel.send(`Nice try. No ping for you.`);

  // prevent from assigning privileged roles
  if (isUnauthorized(rank))
    return message.channel.send(
      `You are in this discord server, but we do not grant you the rank of ${rank}`
    );

  // looks for requested role in list
  const role = message.guild?.roles.cache.find((r) => {
    // edge case coverage, if user enters '10' it assigns 100 Meads without this
    if (rank === "10") rank = "10 ";
    if (rank.length === 1) rank += " ";
    return (
      r.name.toLowerCase() === rank.toLowerCase() ||
      r.name.toLowerCase().startsWith(rank.toLowerCase())
    );
  });
  if (!role)
    return message.channel.send(`The role ${rank} is not a valid role.`);

  // removes other mead community roles
  memberRoles?.forEach((r) => member?.roles.remove(r.id));

  member?.roles.add(role.id);
  return message.channel
    .send(`You have been assigned to role "${role.name}"`)
    .catch((error) => console.error(error));
};
