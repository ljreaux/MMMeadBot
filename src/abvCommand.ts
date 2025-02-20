import { Message } from "discord.js";

const toBrix = (value: number) =>
  -668.962 + 1262.45 * value - 776.43 * value ** 2 + 182.94 * value ** 3;

export const getAbv = (OG: number, FG: number) => {
  const OE = -668.962 + 1262.45 * OG - 776.43 * OG ** 2 + 182.94 * OG ** 3;
  const AE = -668.962 + 1262.45 * FG - 776.43 * FG ** 2 + 182.94 * FG ** 3;
  const q = 0.22 + 0.001 * OE;
  const RE = (q * OE + AE) / (1 + q);
  const ABW = (OE - RE) / (2.0665 - 0.010665 * OE);
  const ABV = Math.round(ABW * (FG / 0.794) * 100) / 100;

  const delle = Math.round(toBrix(FG) + 4.5 * ABV);
  return [delle, ABV];
};

export const handleAbvCommands = (message: Message) => {
  const msg = message.content;
  const [, first, second] = msg.split(" ");
  const [OG, FG] = [Number(first), Number(second) || 0.996];
  const areInvalid = () => {
    return (
      isNaN(OG) ||
      isNaN(FG) ||
      // checking for validity, ABV < 23%
      OG < FG ||
      OG > 1.22 ||
      FG > 1.22 ||
      OG - FG > 0.165
    );
  };

  if (areInvalid())
    return message.channel.send(
      "Please enter a valid number for OG and FG. Example: !abv 1.050 1.010"
    );

  const [delle, ABV] = getAbv(OG, FG);

  const response = `An OG of ${OG.toFixed(3)} and an FG of ${FG.toFixed(
    3
  )} will make ${ABV}% ABV and ${delle} delle units.`;

  return message.channel.send(response);
};

export const handleDelleCommand = (message: Message) => {
  const msg = message.content;
  const [, abv, fg] = msg.split(" ");

  const ABV = parseFloat(abv);
  const FG = parseFloat(fg);

  if (isNaN(ABV) || isNaN(FG)) {
    return message.channel.send(`Please enter a valid ABV and FG.`);
  }

  if (ABV > 23) {
    return message.channel.send(`The ABV provided is too high.`);
  }

  const delle = Math.round(toBrix(FG) + 4.5 * ABV);
  const isStable = delle >= 73;

  const response = `**${ABV.toFixed(2)}%** ABV and a final gravity of **${FG.toFixed(3)}** will give you **${delle} delle units**.\n`;
  const stability = isStable
    ? "Your brew is likely stable without chemical stabilizers."
    : "Your brew will need stabilizers to prevent refermentation.";

  return message.channel.send(response + stability);
};
