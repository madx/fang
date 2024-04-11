import { PermissionFlagsBits } from "discord.js"
import { pick } from "../utils"
import { BotCommandBuilder } from "./"
import { Availability, Bot } from "../bot"

const command: BotCommandBuilder = function deploy(bot) {
  return {
    name: "deploy",
    description: "🤖 Update available commands and permissions",
    availability: bot.AVAILABILITY.BOT_MASTER,

    async execute(interaction) {
      const { commands, guild } = bot

      const commandList = [...commands.values()]

      // Create commands, private by default
      await guild.commands.set(
        commandList.map((command) => ({
          ...pick(command, ["name", "description", "options"]),
          defaultMemberPermissions:
            convertAvailabilityToDefaultMemberPermissions(
              bot,
              command.availability,
            ),
        })),
      )

      await interaction.reply("🤖 Commands deployed!")
    },
  }
}

function convertAvailabilityToDefaultMemberPermissions(
  bot: Bot,
  availability: Availability,
) {
  switch (availability) {
    case bot.AVAILABILITY.PUBLIC:
      return PermissionFlagsBits.UseApplicationCommands
    case bot.AVAILABILITY.MOD:
      return PermissionFlagsBits.KickMembers
    case bot.AVAILABILITY.ADMIN:
      return PermissionFlagsBits.Administrator
    case bot.AVAILABILITY.BOT_MASTER:
      return PermissionFlagsBits.ManageGuild
  }
}

export default command
