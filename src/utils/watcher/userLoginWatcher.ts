import { User } from "discord.js";
import { readFile } from "fs/promises";
import { writeFile } from "fs/promises";

let userWatcherList: Watcher[] = await readFile("./extras/stalkers.json").then((data) => JSON.parse(data as any));

async function reloadWatcherList() {
    userWatcherList = await readFile("./extras/stalkers.json").then((data) => JSON.parse(data as any));
}

async function addWatcher(watcher: Watcher) {
    const existingWatcher = userWatcherList.find(
        (w) => w.discordUserToNotify === watcher.discordUserToNotify && w.mc_server === watcher.mc_server && w.username === watcher.username
    );
    if (existingWatcher) {
        return "exists"
    }
    userWatcherList.push(watcher);
    await writeFile("./extras/stalkers.json", JSON.stringify(userWatcherList, null, 2));
    await reloadWatcherList();
}

function checkWatcherList(mc_server: string, username: string): Watcher[] | null {
    const watchers = userWatcherList.filter((watcher) => watcher.mc_server === mc_server && watcher.username === username);
    return watchers || null;
}

function checkWatcherListByDiscordUser(discordUserToNotify: string): Watcher[] {
    return userWatcherList.filter((watcher) => watcher.discordUserToNotify === discordUserToNotify);
}

const discordJSColorConverter = (color: string) => {
    const colorMap: { [key: string]: number } = {
        "red": 0xff4444, // Red
        "yellow": 0xffff44, // Yellow
        "green": 0x44ff44, // Green
    };
    return colorMap[color] || 0xff4444;
}

async function watcherAlertEmbed(user: User, username: string, action: string, mc_server: string, col: "red" | "yellow" | "green" = "red") {
    const embed = {
        embeds: [
            {
                title: "🔔 **User Watcher Alert**",
                description: `**User:** \`${username}\`\n**Action:** \`${action}\` \n**Server:** \`${mc_server}\`\n**Time:** \`${new Date().toLocaleString()}\``,
                color: discordJSColorConverter(col), 
                timestamp: new Date(),
                footer: {
                    text: `User Watcher Alert`,
                },
                thumbnail: {
                    url: `https://minotar.net/helm/${username}/100.png`,
                },
                fields: [
                    {
                        name: "\u200B", 
                        value: "➖➖➖",
                        inline: false,
                    },
                    {
                        name: "📌 **Tip**",
                        value: `*To remove this watcher, use the command \`/watcher remove ${username}\` in the Discord server you set it up in.*`,
                        inline: false,
                    },
                    {
                        name: "**Need help?**",
                        value: `Visit [our documentation](https://forestbot.org) or contact support.`,
                        inline: false,
                    },
                ],
            }
        ]
    };

    try {
        await user.send(embed);
    } catch (error) {
        console.error(`Failed to send DM to user ${user.tag}:`, error);
    }
}

async function deleteWatcher(discordUserToNotify: string, mc_server: string, username: string) {
    userWatcherList = userWatcherList.filter((watcher) => watcher.discordUserToNotify !== discordUserToNotify && watcher.mc_server !== mc_server && watcher.username !== username);
    await writeFile("./extras/stalkers.json", JSON.stringify(userWatcherList, null, 2));
    await reloadWatcherList();
}

export { userWatcherList, checkWatcherListByDiscordUser, watcherAlertEmbed, reloadWatcherList, addWatcher, deleteWatcher, checkWatcherList };