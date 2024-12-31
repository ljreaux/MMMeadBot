import { Message } from "discord.js";

const { MEAD_MENTOR_ROLE_ID = "" } = process.env;
const meadMentorsList = (message: Message) => {
  const membersList =
    message.guild?.roles.cache.get(MEAD_MENTOR_ROLE_ID)?.members;
  const names = membersList
    ?.map((val) => val.displayName)
    .reduce((acc, val) => (acc += `- ${val}\n`), "\n");
  if (!names) return message.channel.send("No mead mentors found.");
  message.channel.send(`The current Mead Mentors: ${names}`);
};

export default meadMentorsList;
