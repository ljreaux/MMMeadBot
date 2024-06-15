import { recipes } from "./recipes";

const ranks = [
  "Beginner",
  "10 Meads",
  "20 Meads",
  "25 Meads",
  "30 Meads",
  "40 Meads",
  "50 Meads",
  "75 Meads",
  "100 Meads",
];

const rankString = ranks.reduce((acc, r) => {
  return `${acc}\n- ${r}`;
});

const recipesString = Object.keys(recipes).reduce((acc, r) => {
  return `${acc}\n- ${r}`;
});

export interface CommandType {
  command: string;
  response: string;
}

export const commands: CommandType[] = [
  {
    command: "!help",
    response:
      "# **Welcome to the Mead Bot!**\n\nIf you want a list of available commands, run **!list**\n\nIf you would like to change your rank, run **?rank (requested rank)**\nThis will add you to a private channel with your own little mead community.\n\nRun **!recipes** to see a list of common recipes, or **!recipes (recipe name)** to see an individual recipe.",
  },
  {
    command: "!listranks",
    response: `Here is a list of available ranks: \n\n${rankString}`,
  },
  {
    command: "?rank",
    response:
      "The rank command allows you to change your current rank based on the number of meads you have completed.",
  },
  {
    command: "!recipes",
    response: `Here is the full list of recipes.\n- ${recipesString}\n\nRun !recipes (recipe name) to get an individual recipe`,
  },
  {
    command: "!abv",
    response: "",
  },
  {
    command: "!meadtools",
    response:
      "Calculator: https://meadtools.com/\nVideo walkthrough: https://youtube.com/playlist?list=PLK2MubdaaOrUaQnjvfsJnqJv3agRmd4oS&si=ZV0NCqxCioRmg9mq",
  },
  {
    command: "!meadnotes",
    response:
      "https://docs.google.com/document/d/1O0ebgOewuK0a1JKEsmlco3QJ0bp5B0tgGnbGm5S8syU/edit?usp=sharing\nHere are the Mead notes from the mead making 101-501 series.",
  },
  {
    command: "!honeylist",
    response:
      "Here is a list of honey vendors from our wonderful moderator Texas Longhouse Mead.\n- https://www.gardnerbees.buzz/shop\n- https://www.walkerhoneyfarm.com/\n- https://www.dutchgoldhoney.com/\n- https://beenaturalhoney.com/\n- https://flyingbeeranch.net/\n- https://zspecialtyfood.com/\n- https://www.sweetneshoney.com/\n- https://beeseasonal.com/?gclid=CjwKCAjw-L-ZBhB4EiwA76YzOTwO6rQyWHvh2aGVKShJ-Y7wJ2Y4adWFiQh3HbqL0hjCgciv-GTDgRoCHRIQAvD_BwE\n- https://hawaiianhoneyats.com/\n- https://www.sleepingbearfarms.com/product-category/raw-honey/?gclid=CjwKCAjw-L-ZBhB4EiwA76YzOXwDjr0HpedW3b5qWe4DppeU_4-Zd48mqSCczWRfQIFkfp2-S6HyjhoCogUQAvD_BwE\n- https://www.desertcreekhoney.com/?gclid=CjwKCAjw-L-ZBhB4EiwA76YzOSJUYJDdJucdXRao6sMM4Hbl81_pML7aJ-ZPEBrISgx3joGC5NPy8xoCICAQAvD_BwE\n- https://savannahbee.com/?gclid=CjwKCAjw-L-ZBhB4EiwA76YzOVfGxD75mvkq38gsWncycP5T7m-yKFEArPeUeRhbybkul14IHzcm-BoCsv8QAvD_BwE",
  },
  {
    command: "!equipmentlist",
    response:
      "Here is basic equipment list: https://discord.com/channels/568934729676488704/853838172059729920/949501378462634035",
  },
  {
    command: "!raptPillBt",
    response:
      "Check out this cool project: https://discord.com/channels/568934729676488704/853838172059729920/1247224944283353148",
  },
];

export const rankCommand = "?rank ";
export const isUnauthorized = (rank: string) => {
  let unauthorized = false;
  const noRoles = [
    "Administrator",
    "Moderator",
    "Mazer of the Week",
    "Patreon Bot",
    "Discord Mead Leader",
    "MMM Patron",
    "Mead Bot",
    "Rythm",
    "Server Booster",
    "EasyPoll",
    "Live Countdown Bot",
    "YouTube Member",
    "technician",
    "YouTube",
    "YT Bot",
    "UMM2024",
    "UMM 2024 Purgatory Member",
  ];
  noRoles.forEach((item) => {
    if (
      item.toLowerCase() === rank.toLowerCase() ||
      item.toLowerCase().includes(rank.toLowerCase())
    ) {
      unauthorized = true;
    }
  });
  return unauthorized;
};
