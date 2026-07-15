import { ApplicationCommandOptionType } from "discord-api-types/v10";
import type { ChatInputCommandInteraction } from "discord.js";
import { safeReply, type Command } from "./slashCommands";

const WIKI_URL = "https://wiki.meadtools.com";

const WIKI_PAGES = {
  starter: `${WIKI_URL}/recipes`,
  "starter-recipes": `${WIKI_URL}/recipes`,
  user: `${WIKI_URL}/userrecipes`,
  "user-recipes": `${WIKI_URL}/userrecipes`,
  equipment: `${WIKI_URL}/resources/equipment`,
  process: `${WIKI_URL}/process/process_summary`,
  rehydration: `${WIKI_URL}/process/rehydration`,
  "yeast-rehydration": `${WIKI_URL}/process/rehydration`,
  sna: `${WIKI_URL}/process/staggered_nutrient_additions`,
  stabilization: `${WIKI_URL}/process/stabilization`,
  fining: `${WIKI_URL}/process/fining`,
  packaging: `${WIKI_URL}/process/packaging`,
  nutrients: `${WIKI_URL}/ingredients/nutrients`,
  nutes: `${WIKI_URL}/ingredients/nutrients`,
  "getting-started": `${WIKI_URL}/faq/getting_started`,
  troubleshooting: `${WIKI_URL}/faq/basic_problems`,
  "stuck-fermentation": `${WIKI_URL}/protocol/stuck_fermentation`,
  infection: `${WIKI_URL}/faq/infection`,
  hydrometer: `${WIKI_URL}/faq/hydrometer`,
  headspace: `${WIKI_URL}/faq/headspace`,
  sanitation: `${WIKI_URL}/process/sanitation`,
  fermentation: `${WIKI_URL}/process/fermentation`,
  "nutrient-schedules": `${WIKI_URL}/process/nutrient_schedules`,
  backsweetening: `${WIKI_URL}/process/back_sweeten`,
  "bench-trials": `${WIKI_URL}/process/bench_trials`,
  aging: `${WIKI_URL}/process/aging`
} as const;

type WikiPage = keyof typeof WIKI_PAGES;

const CHOICES: Array<{ name: string; value: WikiPage }> = [
  { name: "Starter recipes", value: "starter-recipes" },
  { name: "User recipes", value: "user-recipes" },
  { name: "Equipment", value: "equipment" },
  { name: "Process", value: "process" },
  { name: "Yeast rehydration", value: "yeast-rehydration" },
  { name: "Staggered nutrient additions", value: "sna" },
  { name: "Stabilization", value: "stabilization" },
  { name: "Fining", value: "fining" },
  { name: "Packaging", value: "packaging" },
  { name: "Nutrients", value: "nutrients" },
  { name: "Getting started", value: "getting-started" },
  { name: "Basic troubleshooting", value: "troubleshooting" },
  { name: "Stuck fermentation", value: "stuck-fermentation" },
  { name: "Infections", value: "infection" },
  { name: "Using a hydrometer", value: "hydrometer" },
  { name: "Headspace", value: "headspace" },
  { name: "Sanitation", value: "sanitation" },
  { name: "Fermentation", value: "fermentation" },
  { name: "Nutrient schedules", value: "nutrient-schedules" },
  { name: "Back sweetening", value: "backsweetening" },
  { name: "Bench trials", value: "bench-trials" },
  { name: "Aging", value: "aging" }
];

export const wiki: Command = {
  description: "Get a direct link to a Mead Wiki page.",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "page",
      description: "Pick a wiki page",
      required: false,
      choices: CHOICES
    }
  ],
  fn: async (int: ChatInputCommandInteraction) => {
    const page = int.options.getString("page");
    const url =
      page && Object.hasOwn(WIKI_PAGES, page)
        ? WIKI_PAGES[page as WikiPage]
        : `${WIKI_URL}/`;

    await safeReply(int, `<${url}>`);
  }
};
