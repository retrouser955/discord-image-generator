import * as dotenv from "dotenv"
import DallE2AI from "./bot.js"

dotenv.config()

const ai = new DallE2AI(process.env.TOKEN)

await ai.startBot()
await ai.getCommands('./commands')
await ai.registerCommands()