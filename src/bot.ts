import {
  Client,
  Events,
  GatewayIntentBits,
  Message,
  TextChannel,
} from "discord.js";

import dotenv from "dotenv";
dotenv.config();
const { token, welcomeChannel = "", botSpamChannel = "" } = process.env;

import { rankCommand, handleCommands } from "./commands";
import { handleRecipeCommands } from "./recipes";
import { kickOrBanUser } from "./modCommands";
import { handleRoleCommands } from "./roles";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

client.login(token);
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("messageCreate", (message: Message) => {
  // early return if the message is sent by the bot
  if (message.author.bot) {
    return;
  }

  const msg = message.content;
  const { member } = message;
  const msgEquals = (param: string) => msg.toLowerCase().startsWith(param);

  if (msgEquals("?kick") || msgEquals("?ban"))
    return kickOrBanUser(message, msg);

  if (msgEquals(rankCommand)) return handleRoleCommands(msg, message, member);

  if (msgEquals("!recipes")) return handleRecipeCommands(msg, message);

  if (msgEquals("!abv")) return handleAbvCommands(msg, message);

  return handleCommands(msg, message);
});

client.on("guildMemberAdd", (member) => {
  const channel = client.channels.cache.get(welcomeChannel) as TextChannel;
  channel.send(
    `Welcome to the MMM Discord Server <@${member.user.id}>!\n\n Please head over to <#${botSpamChannel}> and run **?rank (rank)** to recieve a rank and join your mini mead making community.\n\nRun **!recipes** to get a list of popular MMM recipes.\n\nYou can find a list of all commands by running **!list**`
  );
});

// express server
import express, { Express, Request, Response } from "express";
import cors from "cors";

const router = express.Router();

const { PORT = 8080 } = process.env;
const server: Express = express();

server.use(cors());

import bodyParser from "body-parser";
import dbConnect from "./lib/db";
import { handleAbvCommands } from "./abvCommand";
server.use(bodyParser.json({ limit: "50mb" }));

server.use("/", router);

server.listen(PORT, async () => {
  try {
    await dbConnect();
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});

router.get("/", (req: Request, res: Response) => {
  try {
    res.send({ message: "Server running" });
  } catch (error) {
    res.send({ message: "An error occurred" });
  }
});

router.post("", (req: Request, res: Response) => {
  try {
    res.send({ message: "Command List has been updated." });
  } catch (error) {
    res.send({ message: "An error occurred" });
  }
});
