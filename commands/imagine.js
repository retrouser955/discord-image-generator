import { SlashCommandBuilder, EmbedBuilder, ApplicationIntegrationType } from "discord.js";
import { generatePrompt } from "../helpers/generate.js";
import CHOICES from "../helpers/choices.js";

export const name = "imagine";
export const description = "Ask an AI image generator to generate your prompt!";

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addStringOption((option) =>
    option
      .setName("prompt")
      .setDescription("The prompt you want the AI to generate")
      .setRequired(true)
  )
  .addStringOption(option => 
    option.setName("avoid")
    .setDescription("Things you want to avoid in this generation"))
  .addStringOption(option =>
    option.setName('model')
    .setDescription("The AI model you wish to use")
    .addChoices(...CHOICES)
  )
  .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
  .setContexts(0, 1, 2)

export const run = async (client, ctx) => {
  ctx.reply({
    embeds: [
      new EmbedBuilder()
        .setDescription(
          "<a:loading_color:1089371793468432384> **Loading your image please wait!**"
        )
        .setColor("Blue"),
    ],
  });

  try {
    const aiModel = ctx.options.getString("model") ?? "prompthero/openjourney"
    const prompt = ctx.options.getString("prompt")

    const attachment = await generatePrompt(
      aiModel === "prompthero/openjourney" ? `mdjrny-v4 style ${prompt} --v 4` : prompt,
      aiModel,
      ctx.options.getString("avoid") ?? "blurry",
    );

    ctx.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `<:tick:1089371868420653066> **Generated ${ctx.user.username}'s prompt**`
          )
          .setColor("Green")
          .setImage("attachment://image.png"),
      ],
      files: [attachment],
    });
  } catch (error) {
    console.log(error)
    ctx.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `<:musicWrong:936118223076724766> **There was an error. Make sure you are not using a NSFW prompt**`
          )
          .setColor("Red")
      ],
    });
  }
};
