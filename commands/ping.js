import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export const name = "ping"
export const description = "Check the ping of the bot"

export const data = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)

export const run = async (client, ctx) => {
    ctx.reply({
        embeds: [
            new EmbedBuilder()
            .setDescription(`🏓 **Pong! The ping of the bot is \`${client.ws.ping}\`ms**`)
            .setColor("Blue")
        ]
    })
}