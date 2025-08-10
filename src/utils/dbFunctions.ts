import Video from "../models/videos";
import Recipe from "../models/recipes";
import Command from "../models/commands";

export const getVideos = async () => await Video.find();
export const getRecipes = async () => await Recipe.find();
export const getCommands = async () => await Command.find();
