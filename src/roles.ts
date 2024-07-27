import { Message } from "discord.js";
import { isUnauthorized, rankCommand } from "./commands";

export const handleRoleCommands = (
  msg: string,
  message: Message,
  member: Message["member"]
) => {
  // gets members current roles
  const memberRoles = member?.roles.cache.filter((r) => {
    return (
      r.name.toLowerCase().includes("mead") ||
      r.name.toLowerCase() === "beginner"
    );
  });
  // requested role
  let rank = msg.substring(rankCommand.length);

  if (rank.toLowerCase().includes('every')) {
    message.channel.send(
      `Nice try. No ping for you.`
    );
    return;
  }

  // prevent from assigning privileged roles
  if (isUnauthorized(rank)) {
    message.channel.send(
      `You are in this discord server, but we do not grant you the rank of ${rank}`
    );
    return;
  }

  // looks for requested role in list
  const role = message.guild?.roles.cache.find((r) => {
    // edge case coverage, if user enters '10' it assigns 100 Meads without this
    if (rank === "10") rank = "10 ";
    if (rank.length === 1) rank += ' ';
    return (
      r.name.toLowerCase() === rank.toLowerCase() ||
      r.name.toLowerCase().startsWith(rank.toLowerCase())
    );
  });
  if (!role) {
    message.channel.send(`The role ${rank} is not a valid role.`);
    return;
  }
  // removes other mead community roles
  memberRoles?.forEach((r) => member?.roles.remove(r.id));

  member?.roles.add(role.id);
  message.channel
    .send(`You have been assigned to role "${role.name}"`)
    .catch((error) => console.error(error));
  return;
};
