import { Message, PermissionsBitField } from "discord.js";
export const kickUser = (message: Message, msg: string) => {
  if (
    !(
      message.member
        ?.permissionsIn(message.channel.id)
        .has(PermissionsBitField.Flags.Administrator) ||
      message.member
        ?.permissionsIn(message.channel.id)
        .has(PermissionsBitField.Flags.ModerateMembers)
    )
  )
    return;
  let [, user] = msg.split(" ");
  if (!user) {
    message.channel.send("You need to specify a user to kick.");
    return;
  }
  const userToKick = message.mentions.users.first();

  if (!userToKick) {
    message.channel.send("User not found.");
    return;
  }

  message.guild?.members.kick(userToKick);
  message.channel.send(`${userToKick.tag} has been kicked.`);
};

export const banUser = (message: Message, msg: string) => {
  if (
    !(
      message.member
        ?.permissionsIn(message.channel.id)
        .has(PermissionsBitField.Flags.Administrator) ||
      message.member
        ?.permissionsIn(message.channel.id)
        .has(PermissionsBitField.Flags.ModerateMembers)
    )
  )
    return;
  let [, user] = msg.split(" ");
  if (!user) {
    message.channel.send("You need to specify a user to ban.");
    return;
  }
  const userToKick = message.mentions.users.first();

  if (!userToKick) {
    message.channel.send("User not found.");
    return;
  }

  message.guild?.members.ban(userToKick);
  message.channel.send(`${userToKick.tag} has been banned.`);
};
