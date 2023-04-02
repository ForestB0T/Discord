type Guild = {
    guild_id: string,
    channel_id: string,
    mc_server: string,
    setup_by: string,
    created_at: number,
    guild_name: string
}

interface DiscordGuild {
    guild_id: string,
    channel_id: string,
    mc_server: string,
    setup_by: string,
    created_at: number,
    guild_name: string
};

interface DiscordForestBotLiveChat {
    guildName: string
    guildID: string
    channelID: string
    setupBy: string
    date: string,
    mc_server: string
}

interface UserMessageRow {
    name: string;
    message: string;
    date: string;
    mc_server: string;
}

