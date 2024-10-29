import { Message } from "discord.js";
import Recipe from "./models/recipes";

export interface RecipeType {
  name: string;
  link: string;
}

export const getRecipes = async () => await Recipe.find();

export const handleRecipeCommands = async (msg: string, message: Message) => {
  const recipes = await getRecipes();
  const [, recipe] = msg.split(" ");

  if (!recipe) return;
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
