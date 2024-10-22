import { Message, PartialMessage, TextChannel } from "discord.js"

const regex = /belly.*pickle|pickle.*belly|pelly|bickle|sbp|s.b.p|belly.*cucumber|cucumber.*belly|tummy.*pickle|pickle.*tummy/i
export const handleHooligans = async (message: Message | Message<boolean> | PartialMessage) => {
  if (message.content)
    if (regex.test(message.content)) {
      message.channel.send(`${message.member?.user} You've been naughty. Stop that or go to jail. 👮 🚓`)
      await message.delete()

    }
}