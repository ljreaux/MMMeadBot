import { Client, GuildMember } from "discord.js";
import User from "../models/newUser";
const newUserRole = process.env.NEW_USER_ROLE || "";
const GUILD_ID = process.env.GUILD_ID || "";

export async function assignTempRole(member: GuildMember) {
  const joinedAt = new Date();
  const discordId = member.id;

  const newUser = new User({ discordId, joinedAt });
  const savedUser = await newUser.save();
  member.roles.add(newUserRole);

  return {
    discordId: savedUser.discordId,
    joinedAt: savedUser.joinedAt,
    id: savedUser.id,
  };
}

export async function getUserRoles() {
  const users = await User.find({}).then((users) =>
    users.map((user) => {
      return {
        _id: user._id.toString(),
        discordId: user.discordId,
        joinedAt: user.joinedAt,
      };
    })
  );
  return users;
}

export async function checkRoles(
  users: {
    _id: string;
    discordId: string;
    joinedAt: Date;
  }[],
  client: Client
) {
  if (users.length === 0) {
    console.log("No Users Found");
    return;
  }
  const currentTime = new Date().getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const numberOfDays = oneDay * 7;

  users.forEach((user) => {
    if (currentTime - user.joinedAt.getTime() > numberOfDays) {
      const guild = client.guilds.cache.get(GUILD_ID);
      const member = guild?.members.cache.find(
        (member) => member.id === user.discordId
      );
      member?.roles.remove(newUserRole);

      User.deleteOne({ _id: user._id }).then((res) => console.log(res));
      console.log(`Deleted user with discordId ${user.discordId}`);
    }
  });
}
