const { SlashCommandBuilder } = require('@discordjs/builders');
const { Discord, ActionRowBuilder, ButtonBuilder, EmbedBuilder, SelectMenuBuilder, Message, AttachmentBuilder } = require("discord.js");
const fs = require('fs');
const yaml = require("js-yaml")
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'))
const lang = yaml.load(fs.readFileSync('././lang.yml', 'utf8'))

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription(`Submit a suggestion`)
        .addStringOption(option => option.setName('suggestion').setDescription('suggestion').setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        if(config.SuggestionSettings.Enabled === false) return interaction.editReply({ content: "This command has been disabled in the config!", ephemeral: true })
    
        let suggestion = interaction.options.getString("suggestion");

        if(config.SuggestionUpvote.ButtonColor === "BLURPLE") config.SuggestionUpvote.ButtonColor = "Primary"
        if(config.SuggestionUpvote.ButtonColor === "GRAY") config.SuggestionUpvote.ButtonColor = "Secondary"
        if(config.SuggestionUpvote.ButtonColor === "GREEN") config.SuggestionUpvote.ButtonColor = "Success"
        if(config.SuggestionUpvote.ButtonColor === "RED") config.SuggestionUpvote.ButtonColor = "Danger"
    
        if(config.SuggestionDownvote.ButtonColor === "BLURPLE") config.SuggestionDownvote.ButtonColor = "Primary"
        if(config.SuggestionDownvote.ButtonColor === "GRAY") config.SuggestionDownvote.ButtonColor = "Secondary"
        if(config.SuggestionDownvote.ButtonColor === "GREEN") config.SuggestionDownvote.ButtonColor = "Success"
        if(config.SuggestionDownvote.ButtonColor === "RED") config.SuggestionDownvote.ButtonColor = "Danger"
    
        if(config.SuggestionResetvote.ButtonColor === "BLURPLE") config.SuggestionResetvote.ButtonColor = "Primary"
        if(config.SuggestionResetvote.ButtonColor === "GRAY") config.SuggestionResetvote.ButtonColor = "Secondary"
        if(config.SuggestionResetvote.ButtonColor === "GREEN") config.SuggestionResetvote.ButtonColor = "Success"
        if(config.SuggestionResetvote.ButtonColor === "RED") config.SuggestionResetvote.ButtonColor = "Danger"
    
        if(config.SuggestionAccept.ButtonColor === "BLURPLE") config.SuggestionAccept.ButtonColor = "Primary"
        if(config.SuggestionAccept.ButtonColor === "GRAY") config.SuggestionAccept.ButtonColor = "Secondary"
        if(config.SuggestionAccept.ButtonColor === "GREEN") config.SuggestionAccept.ButtonColor = "Success"
        if(config.SuggestionAccept.ButtonColor === "RED") config.SuggestionAccept.ButtonColor = "Danger"
    
        if(config.SuggestionDeny.ButtonColor === "BLURPLE") config.SuggestionDeny.ButtonColor = "Primary"
        if(config.SuggestionDeny.ButtonColor === "GRAY") config.SuggestionDeny.ButtonColor = "Secondary"
        if(config.SuggestionDeny.ButtonColor === "GREEN") config.SuggestionDeny.ButtonColor = "Success"
        if(config.SuggestionDeny.ButtonColor === "RED") config.SuggestionDeny.ButtonColor = "Danger"

        let suggestc = client.channels.cache.get(config.SuggestionSettings.ChannelID)
        if(!suggestc) return interaction.editReply({ content: `Suggestion channel has not been setup! Please fix this in the bot's config!`, ephemeral: true })
        let avatarurl = interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
    
        const upvoteButton = new ButtonBuilder()
        .setCustomId('upvote')
        .setLabel(config.SuggestionUpvote.ButtonName)
        .setStyle(config.SuggestionUpvote.ButtonColor)
        .setEmoji(config.SuggestionUpvote.ButtonEmoji)
    
        const downvoteButton = new ButtonBuilder()
        .setCustomId('downvote')
        .setLabel(config.SuggestionDownvote.ButtonName)
        .setStyle(config.SuggestionDownvote.ButtonColor)
        .setEmoji(config.SuggestionDownvote.ButtonEmoji)
    
      
        const resetvoteButton = new ButtonBuilder()
        .setCustomId('resetvote')
        .setLabel(config.SuggestionResetvote.ButtonName)
        .setStyle(config.SuggestionResetvote.ButtonColor)
        .setEmoji(config.SuggestionResetvote.ButtonEmoji)
    
        const acceptButton = new ButtonBuilder()
        .setCustomId('accept')
        .setLabel(config.SuggestionAccept.ButtonName)
        .setStyle(config.SuggestionAccept.ButtonColor)
        .setEmoji(config.SuggestionAccept.ButtonEmoji)
    
        const denyButton = new ButtonBuilder()
        .setCustomId('deny')
        .setLabel(config.SuggestionDeny.ButtonName)
        .setStyle(config.SuggestionDeny.ButtonColor)
        .setEmoji(config.SuggestionDeny.ButtonEmoji)

        let row = ""
        if(config.SuggestionSettings.EnableAcceptDenySystem) row = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton, resetvoteButton, acceptButton, denyButton);
        if(config.SuggestionSettings.EnableAcceptDenySystem === false) row = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton, resetvoteButton);

        let embed = new EmbedBuilder()
        embed.setColor(config.SuggestionStatusesEmbedColors.Pending)
        embed.setAuthor({ name: `${lang.newSuggestionTitle} (#${client.guildData.get(`${interaction.guild.id}`, "totalSuggestions")})` })
        embed.addFields([
          { name: `• ${lang.suggestionTitle}`, value: `> \`\`\`${suggestion}\`\`\`` },
          ])
        if(config.SuggestionSettings.EnableAcceptDenySystem) embed.addFields([
          { name: `• ${lang.suggestionInformation}`, value: `> **${lang.suggestionFrom}** ${interaction.user}\n> **${lang.suggestionUpvotes}** 0\n> **${lang.suggestionDownvotes}** 0\n> **${lang.suggestionStatus}** ${config.SuggestionStatuses.Pending}` },
          ])
        if(config.SuggestionSettings.EnableAcceptDenySystem === false) embed.addFields([
          { name: `• ${lang.suggestionInformation}`, value: `> **${lang.suggestionFrom}** ${interaction.user}\n> **${lang.suggestionUpvotes}** 0\n> **${lang.suggestionDownvotes}** 0` },
          ])
        embed.setThumbnail(avatarurl)
        embed.setFooter({ text: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
        embed.setTimestamp()
    
        if (suggestc) suggestc.send({ embeds: [embed], components: [row] }).then(async function(msg) {
    
        await client.suggestions.ensure(`${msg.id}`, {
          userID: interaction.user.id,
          msgID: msg.id,
          suggestion: suggestion,
          upVotes: 0,
          downVotes: 0,
          status: "Pending"
        });
    
        client.guildData.inc(interaction.guild.id, "totalSuggestions");
      })
    
      interaction.editReply({ content: lang.suggestionSubmit, ephemeral: true })
    
    }
}