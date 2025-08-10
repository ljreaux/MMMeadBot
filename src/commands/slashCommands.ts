import {
  PermissionsBitField,
  type ChatInputCommandInteraction,
  type PermissionResolvable,
} from "discord.js";
import {
  ApplicationCommandOptionType,
  type APIApplicationCommandOption,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import { meadtoolsCommands } from "./meadTools";
import { getAbv, toBrix } from "../utils/abvCommand";
import { reloadCommands } from "../utils/reloadCommands";
import {
  fetchCloudinaryImages,
  fetchMemes,
  writeToTextFile,
} from "../utils/writeToDv10";
import avocadoImg from "../utils/avocado";
import { rank } from "./rank-select";
import { getCommands, getRecipes, getVideos } from "../utils/dbFunctions";
import { registervideo } from "./registerVideo";
import { sendbotmessage } from "../admin/modCommands";
import { list, listadmin } from "./list";

// ---------- Utilities ----------
const sanitizeName = (raw: string) =>
  raw
    .replace(/^[!?]/, "") // drop legacy prefix
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-") // only a-z 0-9 _ -
    .slice(0, 32) || "cmd";

const makeDescription = (text: string) => {
  // Collapse whitespace, take first 100 chars (Discord requires 1–100)
  const s = text.replace(/\s+/g, " ").trim();
  return s.substring(0, 100) || "Command";
};
// helper to turn PermissionResolvable into the string Discord expects
const resolveDefaultPerms = (p?: PermissionResolvable): string | undefined => {
  if (!p) return undefined;
  // PermissionsBitField.resolve(...) -> bigint; REST expects string
  return PermissionsBitField.resolve(p).toString();
};

// ---------- Types ----------
export type Command = {
  description: string;
  options?: ReadonlyArray<APIApplicationCommandOption>;
  requiredPermissions?: PermissionResolvable;
  fn: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

// Your reusable safe reply helper
export async function safeReply(
  interaction: ChatInputCommandInteraction,
  content: string
) {
  if (interaction.deferred || interaction.replied) {
    return interaction.followUp({ content });
  }
  return interaction.reply({ content });
}

// ---------- Built-in commands (as before) ----------
const builtinCommands: Record<string, Command> = {
  abv: {
    description:
      "Calculates the abv based on an original and final gravity reading.",
    options: [
      {
        type: ApplicationCommandOptionType.Number,
        name: "og",
        description: "The original gravity of your brew.",
        required: true,
        min_value: 0.98,
        max_value: 1.2,
      },
      {
        type: ApplicationCommandOptionType.Number,
        name: "fg",
        description: "The final gravity of your brew.",
        min_value: 0.98,
        max_value: 1.2,
      },
    ],
    fn: async (i) => {
      const og = i.options.getNumber("og", true);
      const fg = i.options.getNumber("fg") ?? 0.996;

      const invalid =
        Number.isNaN(og) ||
        Number.isNaN(fg) ||
        og < fg ||
        og > 1.22 ||
        fg > 1.22 ||
        og - fg > 0.165;

      if (invalid) {
        await safeReply(
          i,
          "Please enter valid gravity values. Example: `/abv og: 1.050 fg: 1.010`"
        );
        return;
      }

      const [delle, ABV] = getAbv(og, fg);
      await safeReply(
        i,
        `An OG of ${og.toFixed(3)} and an FG of ${fg.toFixed(
          3
        )} yields **${ABV}% ABV** and **${delle} delle units**.`
      );
    },
  },
  delle: {
    description: "Calculates delle units from ABV (%) and final gravity (SG).",
    options: [
      {
        type: ApplicationCommandOptionType.Number,
        name: "abv",
        description: "Alcohol by volume percentage (e.g., 12.5).",
        required: true,
        min_value: 0,
        max_value: 23,
      },
      {
        type: ApplicationCommandOptionType.Number,
        name: "fg",
        description: "Final gravity in specific gravity (e.g., 0.996).",
        required: true,
        min_value: 0.98,
        max_value: 1.2,
      },
    ],
    fn: async (i) => {
      const abv = i.options.getNumber("abv", true);
      const fg = i.options.getNumber("fg", true);

      if (
        Number.isNaN(abv) ||
        Number.isNaN(fg) ||
        abv < 0 ||
        abv > 23 ||
        fg < 0.98 ||
        fg > 1.2
      ) {
        await safeReply(
          i,
          "Please provide ABV between 0–23 and FG between 0.980–1.200."
        );
        return;
      }

      const delle = Math.round(toBrix(fg) + 4.5 * abv);
      const isStable = delle >= 73;

      await safeReply(
        i,
        `**${abv.toFixed(2)}%** ABV and FG **${fg.toFixed(
          3
        )}** → **${delle} delle units**.\n` +
          (isStable
            ? "Your brew is likely stable without chemical stabilizers."
            : "Your brew will likely need stabilizers to prevent refermentation.")
      );
    },
  },
  bakingsoda: {
    description: "Learn about using baking soda in mead making.",
    fn: async (i) => {
      await safeReply(i, "Baking soda is not a mead ingredient!!");
    },
  },
  flip: {
    description: "flip",
    fn: async (i) => {
      await safeReply(i, "🚫 No flips allowed! 🚫");
    },
  },
  "refresh-dv10": {
    description: "Refreshes the dv10 image folder.",
    requiredPermissions: "Administrator",
    fn: async (i) => {
      const images = await fetchCloudinaryImages(
        "https://cloudinary-dv10-api.vercel.app/api/list-media"
      );
      await writeToTextFile(images, "images.txt");
      await safeReply(i, "DV10 file has been refreshed.");
    },
  },
  "refresh-shadowhive": {
    description: "Refreshes the dv10 image folder.",
    requiredPermissions: "Administrator",
    fn: async (i) => {
      const images = await fetchCloudinaryImages(
        "https://shadowhive-api.vercel.app/api/list-media"
      );
      await writeToTextFile(images, "shadowhive.txt");
      await safeReply(i, "Shadowhive file has been refreshed.");
    },
  },
  dv10: {
    description: "Get a dv10 image.",
    fn: async (i) => {
      const image = await fetchMemes("images.txt");
      await safeReply(i, image);
    },
  },
  shadowhive: {
    description: "Learn about shadowhive.",
    fn: async (i) => {
      const image = await fetchMemes("shadowhive.txt");
      await safeReply(i, "http://www.shadowhive.com\n" + image);
    },
  },
  avocadohoney: {
    description: "Avocado Honey",
    fn: async (i) => {
      await safeReply(i, avocadoImg());
    },
  },
  refreshcommands: {
    description: "Refreshes slash commands.",
    requiredPermissions: "Administrator", // only admins can run
    fn: async (i) => {
      await reloadCommands();
      await safeReply(i, "Slash commands reloaded ✅");
    },
  },
  meadmentorlist: {
    description: "Get a list of the mead mentors.",
    fn: async (i) => {
      const membersList = i.guild?.roles.cache.get(
        process.env.MEAD_MENTOR_ROLE_ID ?? ""
      )?.members;
      const names = membersList
        ?.map((val) => val.displayName)
        .reduce((acc, val) => (acc += `- ${val}\n`), "\n");

      if (!names) {
        await safeReply(i, "No mead mentors found.");
        return;
      }

      await safeReply(i, `The current Mead Mentors: ${names}`);
    },
  },
  rank,
  registervideo,
  sendbotmessage,
  list,
  listadmin,
  ...meadtoolsCommands,
};

// ---------- DB → slash transform ----------
type DBCommand = { command: string; response: string; description?: string };

function dbToSlashEntry(db: DBCommand): [name: string, cmd: Command] {
  const name = sanitizeName(db.command);
  return [
    name,
    {
      description: db.description ?? makeDescription(db.response),
      fn: async (i) => {
        await safeReply(i, db.response);
      },
    },
  ];
}

// Build the full registry at runtime
export async function buildCommandRegistry(): Promise<{
  commandMap: Record<string, Command>;
  commands: RESTPostAPIChatInputApplicationCommandsJSONBody[];
}> {
  const records: DBCommand[] = await getCommands();
  const videos = await getVideos();

  const dbEntries = records.map(dbToSlashEntry);
  const dbVideos = videos
    .map(({ command, response }) => ({
      response,
      command: command.replace(/^!video\s*/i, "!"),
    }))
    .map(dbToSlashEntry);

  const recipeList = await getRecipes();

  const recipes: Command = {
    description: "Get a video link to an MMM recipe.",
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: "recipe",
        description: "Pick a recipe",
        required: true,
        choices: recipeList
          .map(({ name, link }) => ({ name, value: link }))
          .slice(0, 25),
      },
    ],
    fn: async (int: ChatInputCommandInteraction) => {
      const url = int.options.getString("recipe", true); // this is already the full URL

      await safeReply(int, url);
    },
  };

  const merged: Record<string, Command> = {
    ...Object.fromEntries(dbEntries),
    ...Object.fromEntries(dbVideos),
    ...builtinCommands,
    recipes,
  };

  // @ts-ignore
  const definitions: RESTPostAPIChatInputApplicationCommandsJSONBody[] =
    Object.entries(merged).map(
      ([name, { description, options, requiredPermissions }]) => ({
        name,
        description,
        options,
        // Hide from non-authorized users:
        ...(requiredPermissions
          ? {
              default_member_permissions:
                resolveDefaultPerms(requiredPermissions),
            }
          : {}),
        // prevent DM usage for permissioned commands
        ...(requiredPermissions ? { dm_permission: false } : {}),
      })
    );

  return { commandMap: merged, commands: definitions };
}
