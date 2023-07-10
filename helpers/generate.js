import { HfInference } from "@huggingface/inference";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import chalk from "chalk";
import joinImages from "join-images";

let inference

const HF_ACCESS_TOKEN = process.env.HUGGING_FACE_API_KEY;

console.log(`${chalk.blue("[")} ${chalk.gray("INFO")} ${chalk.blue("]")} : Initialized Hugging Face Client`)

inference = new HfInference(HF_ACCESS_TOKEN, {
  use_gpu: true,
  use_cache: false
})

export async function variationGenerator(prompt, negative_prompt, ctx) {
  const images = []

  ctx.reply({
    embeds: [
      new EmbedBuilder()
      .setDescription(`<a:loading_color:1089371793468432384> **Generating \`1/3\` images**`)
      .setColor("Blue")
    ]
  })

  for(let i = 0; i < 3; i++) {
    if(i !== 0) {
      ctx.editReply({
        embeds: [
          new EmbedBuilder()
          .setDescription(`<a:loading_color:1089371793468432384> **Generating \`${i + 1}/3\` images**`)
          .setColor("Blue")
        ]
      })
    }

    const image = await inference.textToImage({
      inputs: prompt,
      parameters: {
        negative_prompt: negative_prompt ?? "blurry",
        width: 800,
        height: 1000
      },
      model: "dreamlike-art/dreamlike-anime-1.0"
    })

    images.push(Buffer.from(await image.arrayBuffer()))
  }
  
  ctx.editReply({
    embeds: [
      new EmbedBuilder()
      .setDescription(`<:tick:1089371868420653066> **Generated your prompt!**`)
      .setColor("Blue")
    ]
  })

  const sharp = await joinImages.joinImages(images, {
    direction: "horizontal"
  })

  const buffer = await sharp.toFormat("png").toBuffer()

  const attachment = new AttachmentBuilder(buffer, {name:"image.png"})

  ctx.followUp({
    content: ctx.user.toString(),
    files: [attachment]
  })
}

export async function generatePrompt(prompt, model, negative_prompt, name) {
  const image = await inference.textToImage({
    inputs: prompt,
    parameters: {
      negative_prompt: negative_prompt ?? "blurry",
    },
    model: model
  })

  const attachment = new AttachmentBuilder(
    Buffer.from(await image.arrayBuffer()),
    { name: name ?? "image.png" }
  );

  return attachment
}

setInterval(() => {
  console.log(`${chalk.blue("[")} ${chalk.gray("INFO")} ${chalk.blue("]")} : Resetting Hugging Face Client`)
  inference = new HfInference(HF_ACCESS_TOKEN, {
    use_gpu: true,
    use_cache: false
  });
}, 1 * 60 * 60 * 1000)