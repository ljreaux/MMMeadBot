import { Message } from "discord.js";

export interface RecipeType {
  name: string;
  link: string;
}

export const recipes: RecipeType[] = [
  { name: "eightminutemead", link: "https://youtu.be/nA7tLIFcgts" },
  { name: "meadmistakes", link: "https://youtu.be/rCN-TSSsRmc" },
  { name: "yeasttest", link: "https://youtu.be/-_shVjrZIO4" },
  { name: "applecinnamon", link: "https://youtu.be/NF1dhaeysB0" },
  { name: "bottlecarbonation", link: "https://youtu.be/ipPIbB8tS0M" },
  { name: "sweetmead", link: "https://youtu.be/sOpBxyrANlQ" },
  { name: "hoppedblueberry", link: "https://youtu.be/dzUa_K-iRCY" },
  { name: "carbonatedblueberry", link: "https://youtu.be/yAwLpol-G6A" },
  { name: "allstyles", link: "https://youtu.be/08eQ-ylpvKk" },
  { name: "discordmead1", link: "https://youtu.be/K78YNSn5sd8" },
  { name: "discordmead2", link: "https://youtu.be/21OMY2OMmFg" },
  { name: "discordmead3", link: " https://youtu.be/v0PnWMp0COw" },
  { name: "discordmead4", link: "https://youtu.be/ZHfCwTogiqo" },
  { name: "discordmead5", link: "https://youtu.be/wrL0TTeRu0w" },
  { name: "discordmead6", link: "https://youtu.be/RqouA9Fl01s" },
  { name: "discordmead7", link: "https://youtu.be/90HIPS_dnEM" },
  { name: "discordmead8", link: "https://youtu.be/Todjm7wGbPU" },
  { name: "brewsysucks", link: "https://youtu.be/2m-EmXL8QOo" },
  { name: "peppermintmead", link: "https://youtu.be/6T7BdYta4YQ" },
  { name: "mixedberrymead", link: "https://youtu.be/0J-p54wh1tI" },
  { name: "rootbeermead", link: "https://youtu.be/UGuJgqhMwxU" },
  { name: "teamead", link: "https://youtu.be/3Npbhc7Jp1k" },
  { name: "pinacolada", link: "https://youtu.be/INJ-bxrRCBE" },
  { name: "redpyment", link: "https://youtu.be/jESTDN9eqhU" },
  { name: "meadmakingprocess", link: " https://youtu.be/NQmhIQXnnNg" },
  { name: "whitepyment", link: "https://youtu.be/JXit06hwAZY" },
  { name: "punishingyeast", link: "https://youtu.be/CsMJmDdQ-_o" },
  { name: "dndmead", link: "https://youtu.be/GsHlL_Suw4M" },
  { name: "hothoney", link: "https://youtu.be/cBZXGCQFX8I" },
  { name: "meadsquidgame", link: "https://youtu.be/gGD9OuZtILc" },
  { name: "cucumberlime", link: "https://youtu.be/hnT3RXN9v-Q" },
];

export const handleRecipeCommands = (msg: string, message: Message) => {
  const [, recipe] = msg.split(" ");
  const recipeString = recipe?.toLowerCase() || "";
  const foundRecipe = recipes.find((r) => r.name === recipeString);
  if (foundRecipe) {
    message.channel.send(foundRecipe.link);
    return;
  } else if (recipe) {
    message.channel.send(`The recipe ${recipe} is not a valid recipe command.`);
    return;
  }
};
