import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import { generatePrompt } from "../helpers/generate.js"

export const name = "compare"
export const description = "Compare two different AI images for the same prompt"

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
    .setDescription("Things you want to avoid in this generation")
)

export const run = async (client, ctx) => {
    ctx.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "<a:loading_color:1089371793468432384> **Generating the Stable Diffusion model**"
            )
            .setColor("Blue"),
        ],
    });

    const prompt = ctx.options.getString("prompt")

    let stableDiffusionImage

    try {
        stableDiffusionImage = await generatePrompt(
            prompt,
            "stabilityai/stable-diffusion-2-1",
            ctx.options.getString('avoid'),
            "stable.png"
        )
    } catch (error) {
        console.log(error)
        return ctx.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `<:musicWrong:936118223076724766> **There was an error. Make sure you are not using a NSFW prompt**`
              )
              .setColor("Red")
          ],
        });
    }

    ctx.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "<a:loading_color:1089371793468432384> **Generating the OpenJourney Model**"
            )
            .setColor("Blue"),
        ],
    })

    let openjourney;
    
    try {
        openjourney = await generatePrompt(
            `mdjrny-v4 style ${prompt}`,
            "prompthero/openjourney",
            ctx.options.getString('avoid'),
            "open.png"
        )
    } catch (error) {
        console.log(error)
        return ctx.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `<:musicWrong:936118223076724766> **There was an error. Make sure you are not using a NSFW prompt**`
              )
              .setColor("Red")
          ],
        });
    }

    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setLabel("‎")
        .setEmoji("◀️")
        .setStyle(ButtonStyle.Primary)
        .setCustomId('left')
        .setDisabled(true),
        new ButtonBuilder()
        .setLabel("‎")
        .setEmoji("▶️")
        .setStyle(ButtonStyle.Primary)
        .setCustomId('right')
    )

    const paginationEmbeds = [
        new EmbedBuilder()
        .setImage("attachment://open.png")
        .setDescription("<:tick:1089371868420653066> **Generated your prompt**")
        .setFooter({ text: "OpenJourney" })
        .setColor('Green'),
        new EmbedBuilder()
        .setImage("attachment://stable.png")
        .setDescription("<:tick:1089371868420653066> **Generated your prompt**")
        .setColor('Green')
        .setFooter({ text: "Stable Diffusion" }),
    ]

    const message = await ctx.editReply({
        embeds: [paginationEmbeds[0]],
        components: [row],
        files: [openjourney],
        fetchReply: true
    })

    const filter = (i) => {
        if(i.user.id !== ctx.user.id) {
            i.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`<:musicWrong:936118223076724766> **These buttons are not for you!**`)
                    .setColor('Red')
                ],
                ephemeral: true
            })
        }

        return i.user.id === ctx.user.id
    }

    const collector = message.createMessageComponentCollector({ filter, idle: 30000 })

    let current = 0

    collector.on('collect', (i) => {
        if(i.customId === "left") {
            row.components[0].setDisabled(true)
            row.components[1].setDisabled(false)

            current = 0

            return i.update({
                embeds: [paginationEmbeds[0]],
                components: [row],
                files: [openjourney],
                fetchReply: true
            })
        }

        row.components[1].setDisabled(true)
        row.components[0].setDisabled(false)

        current = 1

        return i.update({
            embeds: [paginationEmbeds[1]],
            components: [row],
            files: [stableDiffusionImage],
            fetchReply: true
        })
    })

    collector.on("end", () => {
        for(const component of row.components) {
            component.setDisabled(true)
        }

        message.edit({
            embeds: [paginationEmbeds[current]],
            components: [row],
            files: [current === 0 ? openjourney : stableDiffusionImage],
            fetchReply: true
        })
    })
}