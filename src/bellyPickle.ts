import { Message, PartialMessage, TextChannel } from "discord.js"

const regex = /belly.*pickle|pickle.*belly/i
export const handleHooligans = async (message: Message | Message<boolean> | PartialMessage) => {
  if (message.content)
    if (regex.test(message.content)) {
      message.channel.send(`${message.member?.user} You've been naughty. Stop that or go to jail. 👮 🚓`)
      await message.delete()

    }
}