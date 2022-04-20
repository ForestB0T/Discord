import { CommandInteraction } from 'discord.js';
import { color } from '../index.js';
import { dhms } from '../utils/time/dhms.js';
import fetchData from '../fuctions/fetch.js';
import { convertUnixTimestamp } from '../utils/time/convert.js';
import type ForestBot from '../structure/discord/Client';

export default {
    permissions: "SEND_MESSAGES",
    channel_strict: true,
    requires_setup: true,
    data: {
        name: "search",
        description: "search a users statistics",
        type: 1,
        options: [
            {
                name: "user",
                description: "user you want to lookup",
                type: 3,
                required: true
            }
        ]
    },
    run: async (interaction: CommandInteraction, client: ForestBot, thisGuild: Guild) => {
        let userToSearch = interaction.options.getString("user")

        type User = {
            username:  string,
            kills:     number,
            deaths:    number,
            joins:     number,
            leaves:    number,
            lastseen:  string,
            joindate:  string,
            uuid:      string,
            playtime:  number,
            lastdeath: string,
            mc_server: string
            error:     string
        }

        let data = await fetchData(`${client.apiUrl}/user/${userToSearch}/${thisGuild.mc_server}`) as User;

        if (data.error) {
            return interaction.reply({
                content: `> Could not find user: **${userToSearch}**`,
                ephemeral: true
            })
        }
        
        let lastseenString: string;

        if (/^\d+$/.test(data.lastseen)) {
            lastseenString = convertUnixTimestamp(parseInt(data.lastseen));
        } else {
            lastseenString = data.lastseen;
        }

        const statsEmbed: {} = {
            color: color.gray,
            title: `${userToSearch}`,
            description: `Server: ${data.mc_server}`,
            url: `https://namemc.com/profile/${userToSearch}.2`,

            thumbnail: {
                url: `https://mc-heads.net/avatar/${userToSearch}/70`,
            },
            fields: [

                { name: "Kills", value: `${data.kills}`, inline: true },
                { name: "Deaths", value: `${data.deaths}\n`, inline: true },

                { name: "\u200B", value: "\u200B", inline: true },

                {
                    name: 'First Seen',
                    value: `${data.joindate}`,
                    inline: true
                },
                {
                    name: 'Last Seen',
                    value: `${lastseenString}`,
                    inline: false
                },
                {
                    name: 'Joins / Leaves',
                    value: `${data.joins}`,
                },
                {
                    name: 'Playtime',
                    value: `${dhms(data.playtime)}`,
                },
                {
                    name: 'UUID',
                    value: `${data.uuid}`,
                    inline: false
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
            ],
            image: {
                url: `https://mc-heads.net/player/${userToSearch}`
            },
            timestamp: new Date(),
            footer: {
                text: 'https://forestbot.org'
            },
        }

        return interaction.reply({
            embeds: [statsEmbed], 
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 5,
                    label: "NameMC",
                    url: `https://namemc.com/profile/${userToSearch}`
                }]
            }]
        });

    }
}