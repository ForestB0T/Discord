import { CommandInteraction } from 'discord.js';
import { color } from '../index.js';
import { dhms } from '../utils/time/dhms.js';
import { timeAgoStr } from '../utils/time/convert.js';
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

        await interaction.deferReply();

        let userToSearch = interaction.options.getString("user")

        const uuid = await client.API.convertUsernameToUuid(userToSearch);
        const data = await client.API.getStatsByUuid(uuid, thisGuild.mc_server);

        if (!uuid || !data) { 
            interaction.editReply({
                content: `> Could not find user: **${userToSearch}**`,
            });

            setTimeout(async () => {
                await interaction.deleteReply();
            }, 10000);

            return
        }

        const calculateEngagementLevel = () => {

            const joindate = data.joindate; // millisecond timestamp unix
            const lastseen = data.lastseen; // millisecond timestamp unix
            const playtime = data.playtime; // milliseconds
            
            // we need to check if joindate and lastseen can be converted to numbers, they are strings now.
            // if they cant be converted to numbers, we will return a message saying that the user has not been seen yet.
            // if they can be converted to numbers, we will continue with the calculation.
            //check it with regex
            if (!/^\d+$/.test(joindate) || !/^\d+$/.test(lastseen)) { 
                return "User has not been seen yet.";
            }

            const jd = parseInt(joindate);
            const ls = parseInt(lastseen);

            const totalTimeSinceJoin = ls - jd; // Total time since they joined, in milliseconds
            const playtimeInMs = playtime; // Convert playtime from seconds to milliseconds
        
            const engagementPercentage = (playtimeInMs / totalTimeSinceJoin) * 100;
            return engagementPercentage.toFixed(2) + '%';
        };
        
        let engageLvlString = ""

        const engageLVl = calculateEngagementLevel()        
        if (engageLVl === "User has not been seen yet.") {
            engageLvlString = "Can't be calculated yet.";
        } else {
            engageLvlString = `${userToSearch} has been engaged ${engageLVl} of the time since they have joined the server`;
        }

        const quote = await client.API.getQuote(userToSearch, thisGuild.mc_server);
        const msgCount = await client.API.getMessageCount(userToSearch, thisGuild.mc_server);
        const lastKill = await client.API.getKills(uuid, thisGuild.mc_server, 1, "DESC");
        const lastAdvancement = await client.API.getAdvancements(uuid, thisGuild.mc_server, 1, "DESC");
        const totalAdvancements = await client.API.getTotalAdvancementsCount(uuid, thisGuild.mc_server);


        let lastKillString: string;
        let lastdeath: string;
        let lastseenString: string;
        let firstseenString: string;
        let lastAdvancementString: string;

        if (!lastAdvancement) { 
            lastAdvancementString = "*No advancements recorded*";
        }
        else {
            lastAdvancementString = `${lastAdvancement[0].advancement}, ${timeAgoStr(lastAdvancement[0].time)}`;
        }

        if (!lastKill) {
            lastKillString = "*No kills recorded*";
        } else {
            lastKillString = `${lastKill[0].death_message}, ${timeAgoStr(lastKill[0].time)}`;
        }

        if (!data.lastdeathTime || !data.lastdeathString) { 
            lastdeath = "*Death not recorded*"
        } else {
            lastdeath = `${data.lastdeathString}, ${timeAgoStr(data.lastdeathTime)}`;
        }

        const digitTest = string => {
            if (/^\d+$/.test(string)) {
                return `${convertUnixTimestamp(parseInt(string))}, (${timeAgoStr(parseInt(string))})`;
            } else return string;
        }

        firstseenString = digitTest(data.joindate);
        lastseenString = digitTest(data.lastseen)

        const statsEmbed: {} = {
            color: color.gray,
            title: `${userToSearch}`,
            description: `Server: ${thisGuild.mc_server}`,
            url: `https://forestbot.org/u/${userToSearch}/#`,

            thumbnail: {
                url: `https://mc-heads.net/avatar/${userToSearch}/70`,
            },
            fields: [

                { name: "Kills", value: `${data.kills}`, inline: true },
                { name: "Deaths", value: `${data.deaths}\n`, inline: true },

                { name: "\u200B", value: "\u200B", inline: true },

                {
                    name: 'First Seen',
                    value: `${firstseenString}`,
                    inline: true
                },
                {
                    name: 'Last Seen',
                    value: `${lastseenString}`,
                    inline: false
                },
                {
                    name: 'Last Death',
                    value: `${lastdeath}`,
                    inline: false
                },
                {
                    name: 'Last Kill',
                    value: `${lastKillString}`,
                    inline: false
                },
                {
                    name: "Last Advancement",
                    value: `${lastAdvancementString}`,
                },
                {
                    name: "Total Advancements",
                    value: `${totalAdvancements}`,
                },
                {
                    name: 'Joins / Leaves',
                    value: `${data.joins}`,
                },
                {
                    name: 'Random Quote',
                    value: `${quote.message}`,
                },
                {
                    name: 'Message Count',
                    value: `${msgCount.count}`,
                },
                {
                    name: 'Playtime',
                    value: `${dhms(data.playtime)}`,
                },
                {
                    name: 'Engagement Level',
                    value: `${engageLvlString}`,
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
            footer: {
              text: `https://forestbot.org/u/${userToSearch}`,

            },
            timestamp: new Date(),
        }

        await interaction.editReply({
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

        return;

    }
}