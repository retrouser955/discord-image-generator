import { Client, Collection, GatewayIntentBits, InteractionType, REST, Routes, EmbedBuilder, ActivityType } from "discord.js"
import fs from "node:fs"
import chalk from "chalk";

class DallE2AI {
    token;
    client = new Client({
        intents: [GatewayIntentBits.Guilds]
    });
    commands = new Collection()

    constructor(token) {
        this.client.on('ready', () => {
            const left = chalk.blue("[")
            const right = chalk.blue(']')

            console.log(`${left} ${chalk.gray("Info")} ${right} : Logged into Discord as ${chalk.bold(this.client.user.tag)}`)
        })

        this.token = token || process.env.TOKEN
    }

    async startBot() {
        await this.client.login(this.token)

        this.client.user.setActivity("AI Image Generations", {
            type: ActivityType.Watching
        })

        return this.client
    }

    async registerCommands() {
        const rest = new REST({ version: "10" }).setToken(this.token)
        const apiRoute = Routes.applicationCommands(process.env.ID)

        const commands = this.commands.map(cmd => cmd.data.toJSON())

        let err

        await rest.put(apiRoute, { body: commands }).catch((e) => {
            err = e
            console.log(`There was an error while registering commands. It is as follows\n`, e)
        })

        const left = chalk.blue("[")
        const right = chalk.blue(']')

        if(!err) console.log(`${left} ${chalk.gray("Info")} ${right} : Registered ${chalk.bold(commands.length)} command(s) to the Discord API`)
    }

    async getCommands(route) {
        const dir = fs.readdirSync(route).filter((file) => file.endsWith(".js"))

        const left = chalk.blue("[")
        const right = chalk.blue(']')

        for(const command of dir) {
            const cmd = await import(`${route}/${command}`)

            this.commands.set(cmd.name, cmd)

            console.log(`${left} ${chalk.gray("Info")} ${right} : Loaded Command: ${chalk.bold(command)}`)
        }

        this.#interactionCommandHandler()
    }

    #interactionCommandHandler() {
        this.client.on("interactionCreate", async (ctx) => {
            if(ctx.type !== InteractionType.ApplicationCommand) return

            const command = this.commands.get(ctx.commandName)

            try {
                command.run(this.client, ctx)
            } catch (error) {
                console.log(error)
                ctx.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("There was an Error")
                        .setDescription("❎ There was an error while executing your command. Sorry for the inconvenience!")
                        .setColor("#FFC0CB")
                    ]
                })
            }
        })
    }
}

export default DallE2AI