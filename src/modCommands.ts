import { Message, PermissionsBitField } from "discord.js";
export const kickOrBanUser = (message: Message, msg: string) => {
  const kickOrBan = msg.includes("kick") ? "kick" : "ban";
  if (
    !(
      message.member
        ?.permissionsIn(message.channel.id)
        .has(PermissionsBitField.Flags.Administrator) ||
      message.member
        ?.permissionsIn(message.channel.id)
        .has(PermissionsBitField.Flags.ModerateMembers)
    )
  ) {
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
