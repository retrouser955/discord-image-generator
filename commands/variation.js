import { SlashCommandBuilder, ApplicationIntegrationType } from "discord.js";
import { variationGenerator } from "../helpers/generate.js";

export const name = "variation"
export const description = "Generate 3 images using Dreamlike art Ai model"

export const data = new SlashCommandBuilder()
.setName(name)
.setDescription(description)
.addStringOption((option) => 
    option.setName("prompt")
    .setDescription("The prompt you want the AI to generate. Use simple sentences")
    .setRequired(true)
)
.addStringOption((option) => 
    option.setName('avoid')
    .setDescription("Things you want to avoid in this generation")
)
.setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
.setContexts(0, 1, 2)

export const run = (client, ctx) => {
    const prompt = ctx.options.getString("prompt")
    const negative_prompt = ctx.options.getString("avoid") ?? "blurry"

    variationGenerator(prompt, negative_prompt, ctx)
}