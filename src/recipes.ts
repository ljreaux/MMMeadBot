import { Message, TextChannel } from "discord.js";
import Recipe from "./models/recipes";

export interface RecipeType {
  name: string;
  link: string;
}

export const getRecipes = async () => await Recipe.find();

export const handleRecipeCommands = async (message: Message) => {
  const recipes = await getRecipes();
  const msg = message.content;
  const [, recipe] = msg.split(" ");

  if (!recipe) return;
  const recipeString = recipe?.toLowerCase() || "";
  const foundRecipe = recipes.find((r) => r.name === recipeString);
  if (foundRecipe) {
    (message.channel as TextChannel).send(foundRecipe.link);
    return;
  } else if (recipe) {
    (message.channel as TextChannel).send(
      `The recipe ${recipe} is not a valid recipe command.`
    );
    return;
  }
};
