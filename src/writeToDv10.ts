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

export const dv10 = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const images = data.split("\n").map((d)=> d.trim()).filter(l => l.length > 0)

    if (images.length) return images[Math.floor(Math.random() * images.length)];
    else throw Error("No lines found.");
  } catch (err) {
    console.error(err);
    return "";
  }
};
