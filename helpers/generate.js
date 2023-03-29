import { HfInference } from "@huggingface/inference";
import { AttachmentBuilder } from "discord.js";
import chalk from "chalk";

let inference

const HF_ACCESS_TOKEN = process.env.HUGGING_FACE_API_KEY;

console.log(`${chalk.blue("[")} ${chalk.gray("INFO")} ${chalk.blue("]")} : Initialized Hugging Face Client`)

inference = new HfInference(HF_ACCESS_TOKEN, {
  use_gpu: true,
})

export async function generatePrompt(prompt, model, negative_prompt, name) {
  const image = await inference.textToImage({
    inputs: prompt,
    negative_prompt: negative_prompt ?? "blurry",
    model: model,
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
  });
}, 1 * 60 * 60 * 1000)