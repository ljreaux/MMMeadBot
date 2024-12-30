import { Message } from "discord.js";

const BASE_URL = "https://meadtools.com";

const nuteArgs = ["nutes", "nutrients", "nuteCalc"].map((arg) => ({
  arg,
  link: "/NuteCalc",
}));

const extraCalcsArgs = [
  "brixCalc",
  "estOG",
  "benchTrials",
  "sulfite",
  "sorbate",
  "RefractometerCorrection",
  "tempCorrection",
  "blending",
].map((arg) => ({
  arg,
  link: `/ExtraCalcs/${arg}`,
}));

const argsWithBaseUrl = [
  ...nuteArgs,
  ...extraCalcsArgs,
  { arg: "stabilizers", link: "/stabilizers" },
  { arg: "abv", link: "/ExtraCalcs" },
  { arg: "brix", link: "/ExtraCalcs/brixCalc" },
  { arg: "temp", link: "/ExtraCalcs/tempCorrection" },
  { arg: "refractometer", link: "/ExtraCalcs/RefractometerCorrection" },
  { arg: "estimatedOG", link: "/ExtraCalcs/estOG" },
  { arg: "trials", link: "/ExtraCalcs/benchTrials" },
  { arg: "juice", link: "/juice" },
].map((arg) => ({
  ...arg,
  link: `${BASE_URL}${arg.link}`,
}));

const VALID_ARGS = [
  ...argsWithBaseUrl,
  {
    arg: "yeast",
    link: "https://yeasts.meadtools.com",
  },
];

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
    return message.channel.send(foundArg.link);
  } else {
    return message.channel.send(baseResponse);
  }
};

export const listArgs = (message: Message) => {
  // Group the arguments by their `link`
  const grouped = VALID_ARGS.groupBy((a) => a.link);

  // Construct the Markdown message
  const formattedMessage = Object.entries(grouped)
    .map(([link, args]) => {
      const lastPartOfUrl = link.split("/").pop() || ""; // Extract the last part of the URL
      const argsList = args.map((arg) => `- ${arg.arg}`).join("\n");
      return `**${lastPartOfUrl}**\n${argsList}`;
    })
    .join("\n\n");

  // Send the formatted message
  message.channel.send(
    `Here are all the available arguments organized by URL path:\n\n${formattedMessage}`
  );
};
