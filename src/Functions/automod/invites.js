const { MessageEmbed } = require('discord.js');

module.exports = (client, msg) => {
    if (!client.settings.modrole || !client.settings.mutedrole || !client.settings.messagelog) {
        return;
    }

    const censor = client.automod.invites || [];
    const censorChecks = !!censor.find((word) => {
        if (msg.member.roles.cache.has(client.settings.modrole)) {
            return;
        }
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(msg.content);
    });

    if (censorChecks) {
        setTimeout(() => {
            msg.delete().catch((err) => {console.error(err)})
        }, 0);
        client.channels.fetch(client.settings.messagelog).then(channel => {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(msg.author.avatarURL({
                    dynamic: true
                }))
                .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id}) tried to advertise in <#${msg.channel.id}>\n\n Message Deleted: ||${msg.content}||\n\n** **`);
            return channel.send({
                embed
            });
        });
    }
} 