import * as dotenv from "dotenv"
import DallE2AI from "./bot.js"
import chalk from "chalk"

dotenv.config()

const left = chalk.blue("[")
const right = chalk.blue(']')

const ai = new DallE2AI(process.env.TOKEN)

await ai.startBot()
await ai.getCommands('./commands')
await ai.registerCommands()

let minutes = 0
console.log(`${left} ${chalk.gray("PING")} ${right} : ${chalk.bold(ai.client.ws.ping)}ms. Bot just started!`)

setInterval(() => {
    minutes++
    console.log(`${left} ${chalk.gray("PING")} ${right} : ${chalk.bold(ai.client.ws.ping)}ms. Bot has been up for ${chalk.bold(minutes)} minutes`)
}, 60 * 1000)