import { Message } from "discord.js";
import fs from "fs";

const filePath = "./dv10.txt";

export default function writeToDv10File(message: Message) {
  const image = message.attachments
    .toJSON()
    ?.map((i) => i?.url)
    .join("\n");

  if (image !== "[]")
    fs.appendFile(filePath, "\n" + image, (err) => console.error(err));
}

export const dv10 = (message: Message) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return [];
    }

    // Split the file content into an array of lines
    const lines = data.split("\n");
    if (lines.length)
      message.channel.send(lines[Math.floor(Math.random() * lines.length)]);
    else console.error("No lines found.");
  });
};
