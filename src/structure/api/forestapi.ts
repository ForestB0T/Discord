import fetch from "node-fetch";
import { cnf } from "../../index.js";


type AddGuildArgs = DiscordGuild;
type RemoveLiveChatArgs = { guild_id: string, channel_id?: string|null };
type AddLiveChatArgs = DiscordForestBotLiveChat;
type RemoveGuildArgs = { guild_id: string };
type GetUserMessageArgs = { username: string, mc_server: string, limit: number, type: "ASC"|"DESC" }
interface ForestBotApiResponse {
    success: boolean,
    data?: any,
    message?: string,
    messages?: any
}

export default class ForestBotAPI {

    private apiUrl: string = cnf.apiUrl??"https://api.forestbot.org";
    private apiKey: string = process.env.apikey;


    /**
     * Get all discord guilds that forestbot has been setup in.
     * @returns Promise<DiscordGuild[]|null>
     */
    public async getAllGuilds(): Promise<DiscordGuild[]|null> {
        
        try {
            const response = await fetch(`${this.apiUrl}/getguilds/${this.apiKey}`);
            if (!response || !response.ok) throw new Error("Error getting all guilds from api.");
            const data = await response.json() as ForestBotApiResponse;
            return data.data as DiscordGuild[];

        } catch (err) {
            console.error(err, "getAllGuilds Error")
            return null;
        }
    }

    /**
     * Adding a LiveChat to database.
     * @param args AddLiveChatArgs
     * @returns Promise<ForestBotApiResponse|null> 
     */
    public async addLiveChat(args: AddLiveChatArgs): Promise<ForestBotApiResponse|null> {
        try {
            const response = await fetch(`${this.apiUrl}/addlivechat/${this.apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(args)
            })
            if (!response || !response.ok) throw new Error("Adding livechat result not ok.");

            return await response.json() as ForestBotApiResponse;

        } catch (error) {
            console.error(error, "addLiveChat Error")
            return null;
        }
    }

    /**
     * Adding a guild to database
     * @param args AddGuildArgs
     * @returns Promise<ForestBotApiResponse|null> 
     */
    public async addGuild(args: AddGuildArgs): Promise<ForestBotApiResponse|null> {
        try {
            const response = await fetch(`${this.apiUrl}/addguild/${this.apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(args)
            })
            if (!response || !response.ok) throw new Error("Adding guild result not ok.");

            return await response.json() as ForestBotApiResponse;

        } catch (error) {
            console.error(error, "addGuild Error")
            return null;
        }
    }


    /**
     * Removing a guild from the database.
     * @param args RemoveGuildArgs
     * @returns Promise<ForestBotApiResponse|null> 
     */
    public async removeGuild(args: RemoveGuildArgs): Promise<ForestBotApiResponse|null> {
        try {
            const response = await fetch(`${this.apiUrl}/removeguild/${this.apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(args)
            })
            if (!response || !response.ok) throw new Error("Removing guild result not ok.");

            return await response.json() as ForestBotApiResponse;

        } catch (error) {
            console.error(error, "removeGuild Error")
            return null;
        }
    }


    /**
     * Removing a live chat from the database.
     * @param args RemoveLiveChatArgs
     * @returns Promise<ForestBotApiResponse|null> 
     */
    public async removeLiveChat(args: RemoveLiveChatArgs): Promise<ForestBotApiResponse|null> {
        try {
            const response = await fetch(`${this.apiUrl}/removelivechat/${this.apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(args)
            })
            if (!response || !response.ok) throw new Error("Removing guild result not ok.");

            return await response.json() as ForestBotApiResponse;
        } catch (error) {
            console.error(error, "removeLiveChatGuild Error")
            return null;
        }
    }


    /**
     * Get last messages.
     * @param args 
     * @returns 
     */
    public async getMessages(args: GetUserMessageArgs): Promise<UserMessageRow[]|null> {
        const { username, mc_server, limit, type } = args;
        try {
            const response = await fetch(`${this.apiUrl}/messages/${username}/${mc_server}/${limit}/${type}`);
            if (!response || !response.ok) throw new Error("bad response while getting user messages.");

            const data = await response.json() as ForestBotApiResponse;
            if (!data.success) throw new Error("false success while getting user messages: " + data.message);

            return data.data.messages;

        } catch (err) {
            console.error(err, " Error in getMessages");
            return null;
        }
    }

    public async getAllLiveChatChannels(): Promise<DiscordForestBotLiveChat[]|null> {
        try {
            const response = await fetch(`${this.apiUrl}/getchannels/${this.apiKey}`);
            if (!response || !response.ok) throw new Error("not ok response.");

            const channels = await response.json() as ForestBotApiResponse;
            if (!channels.success) throw new Error("no channels success");

            return channels.data as DiscordForestBotLiveChat[];

        } catch (err) {
            console.error("error getting all live chats.");
            return null;
        }
    }


}