import { ApplicationCommandOptionType } from "discord-api-types/v10";
import type {
  ChatInputCommandInteraction,
  AutocompleteInteraction
} from "discord.js";
import { safeReply, type Command } from "./slashCommands";

const VIDEO_URL = "https://www.youtube.com/watch?v=N9apBhItPnk";
const VIDEO_ID = new URL(VIDEO_URL).searchParams.get("v") ?? "";

export function parseTimestampToSeconds(timestamp: string): number {
  const parts = timestamp
    .trim()
    .split(":")
    .map((p) => Number(p));

  if (parts.some((n) => Number.isNaN(n))) {
    throw new Error(`Invalid timestamp (non-number): "${timestamp}"`);
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  throw new Error(`Invalid timestamp format: "${timestamp}"`);
}

export function honeyLinkAt(timestamp: string) {
  const seconds = parseTimestampToSeconds(timestamp);
  // Use videoId + seconds so it’s clean and consistent
  return `https://www.youtube.com/watch?v=${VIDEO_ID}&t=${seconds}s`;
}

export const honeyVarieties = [
  { name: "Honey Varieties", timestamp: "04:00" },
  { name: "Angico", timestamp: "06:24" },
  { name: "Alfalfa", timestamp: "07:03" },
  { name: "Almond", timestamp: "08:28" },
  { name: "Apple", timestamp: "09:17" },
  { name: "Aroeira", timestamp: "09:48" },
  { name: "Aster", timestamp: "10:21" },
  { name: "Avocado", timestamp: "12:19" },
  { name: "Basswood", timestamp: "13:16" },
  { name: "Black Locust", timestamp: "14:06" },
  { name: "Blueberry", timestamp: "15:14" },
  { name: "Brazilian Pepper Tree", timestamp: "15:53" },
  { name: "Buckwheat (Eastern)", timestamp: "16:37" },
  { name: "Buckwheat (Western)", timestamp: "18:10" },
  { name: "Cactus", timestamp: "18:46" },
  { name: "California Buckeye", timestamp: "19:11" },
  { name: "Canola", timestamp: "20:00" },
  { name: "Carrot", timestamp: "20:37" },
  { name: "Chestnut", timestamp: "21:02" },
  { name: "Chicory", timestamp: "21:32" },
  { name: "Clover", timestamp: "22:09" },
  { name: "Coconut", timestamp: "23:03" },
  { name: "Coffee", timestamp: "24:10" },
  { name: "Coriander", timestamp: "25:00" },
  { name: "Cotton", timestamp: "25:37" },
  { name: "Cranberry", timestamp: "26:52" },
  { name: "Dandelion", timestamp: "27:55" },
  { name: "Eucalyptus", timestamp: "29:07" },
  { name: "Fireweed", timestamp: "29:42" },
  { name: "Gallberry", timestamp: "30:18" },
  { name: "Guajillo", timestamp: "30:49" },
  { name: "Goldenrod", timestamp: "30:23" },
  { name: "Hawaiian Kiawe", timestamp: "32:07" },
  { name: "Hawaiian Lehua", timestamp: "32:40" },
  { name: "Heather", timestamp: "33:03" },
  { name: "Honeydew", timestamp: "33:45" },
  { name: "Heather (Erica SP)", timestamp: "34:14" },
  { name: "Japanese Knotweed", timestamp: "35:42" },
  { name: "Kudzu", timestamp: "36:32" },
  { name: "Lavender", timestamp: "37:42" },
  { name: "Leatherwood", timestamp: "38:10" },
  { name: "Lychee", timestamp: "38:50" },
  { name: "Macadamia", timestamp: "39:35" },
  { name: "Mangrove", timestamp: "40:00" },
  { name: "Manuka", timestamp: "40:34" },
  { name: "Maple", timestamp: "40:54" },
  { name: "Marmeleiro", timestamp: "41:40" },
  { name: "Meadowfoam", timestamp: "42:25" },
  { name: "Mesquite", timestamp: "43:08" },
  { name: "Mint", timestamp: "43:50" },
  { name: "Mustard", timestamp: "44:34" },
  { name: "Orange", timestamp: "44:53" },
  { name: "Phacelia", timestamp: "45:53" },
  { name: "Pomegranate", timestamp: "46:25" },
  { name: "Pumpkin", timestamp: "46:45" },
  { name: "Radish", timestamp: "48:00" },
  { name: "Raspberry", timestamp: "48:22" },
  { name: "Rhododendron (Mad Honey)", timestamp: "49:04" },
  { name: "Rosemary", timestamp: "50:28" },
  { name: "Safflower", timestamp: "50:55" },
  { name: "Sage (Black Button)", timestamp: "51:21" },
  { name: "Sage (White)", timestamp: "52:07" },
  { name: "Sage (Purple)", timestamp: "52:35" },
  { name: "Sainfoin", timestamp: "52:54" },
  { name: "Saw Palmetto", timestamp: "53:52" },
  { name: "Sidr", timestamp: "54:07" },
  { name: "Snowberry", timestamp: "54:50" },
  { name: "Sourwood", timestamp: "55:34" },
  { name: "Spanish Needle", timestamp: "56:35" },
  { name: "Star Thistle (Purple)", timestamp: "57:27" },
  { name: "Star Thistle (Yellow)", timestamp: "58:02" },
  { name: "Strawberry Tree", timestamp: "58:25" },
  { name: "Sunflower", timestamp: "59:07" },
  { name: "Sweet Clover", timestamp: "59:39" },
  { name: "Tallow Tree", timestamp: "1:01:29" },
  { name: "Thyme", timestamp: "1:01:54" },
  { name: "Toyon", timestamp: "1:02:25" },
  { name: "Tulip Tree", timestamp: "1:02:55" },
  { name: "Tupelo", timestamp: "1:03:27" },
  { name: "Ulmo", timestamp: "1:04:15" },
  { name: "Vetch (Hairy)", timestamp: "1:04:47" },
  { name: "Yaupon", timestamp: "1:05:21" },
  { name: "Wildflower", timestamp: "1:05:53" },
  { name: "Honey Suppliers", timestamp: "1:08:08" },
  { name: "Further Reading", timestamp: "1:08:53" }
];

const normalize = (s: string) => s.toLowerCase().trim();

function findHoneyByName(name: string) {
  const q = normalize(name);

  // exact match first
  const exact = honeyVarieties.find((h) => normalize(h.name) === q);
  if (exact) return exact;

  // fallback: startsWith
  const starts = honeyVarieties.find((h) => normalize(h.name).startsWith(q));
  if (starts) return starts;

  // fallback: includes
  return honeyVarieties.find((h) => normalize(h.name).includes(q));
}

export const honey: Command & {
  autocomplete?: (i: AutocompleteInteraction) => Promise<void>;
} = {
  description: "Get a link to the honey varietal timestamp in the video.",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "variety",
      description: "Start typing a honey varietal (autocomplete)",
      required: true,
      autocomplete: true
    }
  ],
  fn: async (i: ChatInputCommandInteraction) => {
    const variety = i.options.getString("variety", true);

    const entry = findHoneyByName(variety);
    if (!entry) {
      await safeReply(i, `Couldn't find "${variety}". Try another spelling.`);
      return;
    }

    const url = honeyLinkAt(entry.timestamp);
    await safeReply(i, `**${entry.name}** (${entry.timestamp})\n${url}`);
  },

  autocomplete: async (i: AutocompleteInteraction) => {
    const focused = i.options.getFocused(true);
    const q = normalize(String(focused.value ?? ""));

    const matches = honeyVarieties
      .filter((h) => (q ? normalize(h.name).includes(q) : true))
      .slice(0, 25) // Discord autocomplete response cap is 25
      .map((h) => ({
        name: `${h.name} (${h.timestamp})`,
        value: h.name // what gets passed into the command
      }));

    await i.respond(matches);
  }
};

export default honey;
