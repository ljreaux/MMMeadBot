import { Message, TextChannel } from "discord.js";

const { MEAD_MENTOR_ROLE_ID = "" } = process.env;
const meadMentorsList = (message: Message) => {
  const membersList =
    message.guild?.roles.cache.get(MEAD_MENTOR_ROLE_ID)?.members;
  const names = membersList
    ?.map((val) => val.displayName)
    .reduce((acc, val) => (acc += `- ${val}\n`), "\n");
  if (!names)
    return (message.channel as TextChannel).send("No mead mentors found.");
  (message.channel as TextChannel).send(`The current Mead Mentors: ${names}`);
};

export default meadMentorsList;
