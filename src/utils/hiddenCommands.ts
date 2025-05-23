import { handleRecipeCommands } from "../recipes";
import { handleAbvCommands, handleDelleCommand } from "../abvCommand";
import {
  kickOrBanUser,
  listAdminCommands,
  refreshDv10,
  refreshShadowHive,
  registerVideo,
} from "../modCommands";

import { handleVideos } from "../videos";
import avocadoImg from "../avocado";
import { fetchMemes } from "../writeToDv10";
import { listArgs, meadTools } from "../meadTools";
import meadMentorsList from "../meadMentors";
import { Message, TextChannel } from "discord.js";

export const hiddenCommands = [
  { command: "?kick", func: kickOrBanUser },
  { command: "?ban", func: kickOrBanUser },
  { command: "!recipes", func: handleRecipeCommands },
  { command: "!video", func: handleVideos },
  { command: "!abv", func: handleAbvCommands },
  { command: "!delle", func: handleDelleCommand },
  { command: "?registerVideo", func: registerVideo },
  { command: "!refreshImages", func: refreshDv10 },
  { command: "!refreshShadowHive", func: refreshShadowHive },
  { command: "!adminlist", func: listAdminCommands },
  { command: "!meadtools", func: meadTools },
  { command: "!arglist", func: listArgs },
  { command: "!mentorlist", func: meadMentorsList },
  {
    command: "!flip",
    func: (message: Message) => {
      return (message.channel as TextChannel).send("🚫 No flips allowed! 🚫");
    },
  },
  {
    command: "!bakingsoda",
    func: (message: Message) => {
      return (message.channel as TextChannel).send(
        "Baking soda is not a mead ingredient!!"
      );
    },
  },
  {
    command: "!avocadohoney",
    func: (message: Message) => {
      return (message.channel as TextChannel).send(avocadoImg());
    },
  },
  {
    command: "!dv10",
    func: async (message: Message) => {
      return (message.channel as TextChannel).send(
        await fetchMemes("images.txt")
      );
    },
  },
  {
    command: "!shadowhive",
    func: async (message: Message) => {
      return (message.channel as TextChannel).send(
        await fetchMemes("shadowhive.txt")
      );
    },
  },
];
