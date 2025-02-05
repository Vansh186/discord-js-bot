const { Command } = require("@src/structures");
const {
  MessageEmbed,
  Message,
  CommandInteraction,
  CommandInteractionOptionResolver,
  ContextMenuInteraction,
} = require("discord.js");
const { EMOJIS, EMBED_COLORS } = require("@root/config.js");
const { resolveMember } = require("@utils/guildUtils");

module.exports = class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: "avatar",
      description: "displays avatar information about the user",
      cooldown: 5,
      command: {
        enabled: true,
        usage: "[@member|id]",
        category: "INFORMATION",
        botPermissions: ["EMBED_LINKS"],
      },
      slashCommand: {
        enabled: true,
        options: [
          {
            name: "user",
            description: "the user to get the avatar for",
            type: "USER",
            required: false,
          },
        ],
      },
      contextMenu: {
        enabled: true,
        type: "USER",
      },
    });
  }

  /**
   * @param {Message} message
   * @param {string[]} args
   */
  async messageRun(message, args) {
    const target = (await resolveMember(message, args[0])) || message.member;
    const { user } = target;
    const embed = buildEmbed(user);
    message.channel.send({ embeds: [embed] });
  }

  /**
   * @param {CommandInteraction} interaction
   * @param {CommandInteractionOptionResolver} options
   */
  async interactionRun(interaction, options) {
    const target = options.getUser("user") || interaction.user;
    const embed = buildEmbed(target);
    interaction.followUp({ embeds: [embed] });
  }

  /**
   * @param {ContextMenuInteraction} interaction
   */
  async contextRun(interaction) {
    const user = await interaction.client.users.fetch(interaction.targetId);
    const embed = buildEmbed(user);
    interaction.followUp({ embeds: [embed] });
  }
};

const buildEmbed = (user) => {
  const x64 = user.displayAvatarURL({ format: "png", dynamic: true, size: 64 });
  const x128 = user.displayAvatarURL({ format: "png", dynamic: true, size: 128 });
  const x256 = user.displayAvatarURL({ format: "png", dynamic: true, size: 256 });
  const x512 = user.displayAvatarURL({ format: "png", dynamic: true, size: 512 });
  const x1024 = user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });
  const x2048 = user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 });

  const embed = new MessageEmbed()
    .setTitle(`Avatar of ${user.username}`)
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setImage(x256)
    .setDescription(
      `Links: ${EMOJIS.CIRCLE_BULLET} [x64](${x64}) ` +
        `${EMOJIS.CIRCLE_BULLET} [x128](${x128}) ` +
        `${EMOJIS.CIRCLE_BULLET} [x256](${x256}) ` +
        `${EMOJIS.CIRCLE_BULLET} [x512](${x512}) ` +
        `${EMOJIS.CIRCLE_BULLET} [x1024](${x1024}) ` +
        `${EMOJIS.CIRCLE_BULLET} [x2048](${x2048}) `
    );

  return embed;
};
