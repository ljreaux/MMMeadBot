import { Message, TextChannel } from "discord.js";

const BASE_URL = "https://meadtools.com";

const nuteArgs = ["nutes", "nutrients", "nuteCalc"].map((arg) => ({
  arg,
  link: "/nute-calc",
}));

const extraCalcsArgs = [
  "brix",
  "estimated-og",
  "bench-trials",
  "sulfite",
  "sorbate",
  "refractometer-correction",
  "temperature-correction",
  "blending",
  "priming-sugar",
].map((arg) => ({
  arg,
  link: `/extra-calcs/${arg}`,
}));

const argsWithBaseUrl = [
  ...nuteArgs,
  ...extraCalcsArgs,
  { arg: "stabilizers", link: "/stabilizers" },
  { arg: "abv", link: "/extra-calcs" },
  { arg: "brix", link: "/extra-calcs/brix" },
  { arg: "temp", link: "/extra-calcs/temperature-correction" },
  { arg: "refractometer", link: "/extra-calcs/refractometer-correction" },
  { arg: "estimatedOG", link: "/extra-calcs/estimated-og" },
  { arg: "trials", link: "/extra-calcs/bench-trials" },
  { arg: "priming", link: "/extra-calcs/priming-sugar" },
  { arg: "juice", link: "/juice" },
  { arg: "yeast", link: "/yeast" },
  { arg: "tutorial", link: "/tutorial" },
].map((arg) => ({
  ...arg,
  link: `${BASE_URL}${arg.link}`,
}));

const VALID_ARGS = [...argsWithBaseUrl];

export const meadTools = (message: Message) => {
  const baseResponse = `[Calculator](<https://meadtools.com/>)
[Video walkthrough](<https://youtube.com/playlist?list=PLK2MubdaaOrUaQnjvfsJnqJv3agRmd4oS&si=ZV0NCqxCioRmg9mq>)

Run the command again with an argument from the list to get a more specific link. 
Run \`!arglist\`  for a list of arguments
  `;
  const [, arg] = message.content.split(" ");
  const foundArg = VALID_ARGS.find((a) =>
    arg?.toLowerCase().startsWith(a.arg.toLowerCase())
  );

  if (foundArg) {
    return (message.channel as TextChannel).send(foundArg.link);
  } else {
    return (message.channel as TextChannel).send(baseResponse);
  }
};

export const listArgs = (message: Message) => {
  const grouped = VALID_ARGS.groupBy((a) => a.link);
  const formattedMessage = Object.entries(grouped)
    .map(([link, args]) => {
      const lastPartOfUrl = link.split("/").pop() || ""; // Extract the last part of the URL
      const argsList = args.map((arg) => `- ${arg.arg}`).join("\n");
      return `**${lastPartOfUrl}**\n${argsList}`;
    })
    .join("\n\n");

  // Send the formatted message
  (message.channel as TextChannel).send(
    `Here are all the available arguments organized by URL path:\n\n${formattedMessage}`
  );
};
