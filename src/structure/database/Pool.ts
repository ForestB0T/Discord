import { createPool, Pool, PoolConfig } from "mysql";
import { client, db } from "../../index.js";

export default class Database {
    public database: Pool;

    constructor(options: PoolConfig) {
        this.database = createPool(options);
        this.database.getConnection(e => {
            if (e) throw new Error(e.message);
            console.log("Connected to database.");
            return;
        })
    }

    /**
     * Promises query function
     * @param query 
     * @param args 
     * @returns database results
     */
    public pQuery = (query: string, args?: any[]) => new Promise((resolve, reject) => this.database.query(
        query,
        args,
        (err, res) => {
            if (err) return reject(err)
            return resolve(res);
        }
    ))

    /**
     * Get all guilds the bot has saved to database
     * @returns Promise<Guild[]> 
     */
    public async getGuilds(): Promise<Guild[]> {
        const res = await this.pQuery(`SELECT * FROM guilds`) as Guild[];
        return res;
    }

    /**
     * Remove a guild from the database
     * @param guildID 
     * @returns 
     */
    public removeGuild = (guildID: string) => new Promise(async (res, rej) => {
        try {
            await this.pQuery(`DELETE FROM guilds WHERE guild_id = ?`, [guildID]);
            res(true)
        } catch (err) {
            console.log("Error trying to remove guild: " + err + " " + guildID);
            rej(false);
        }
    })

    /**
     * Add a guild to the database
     * @param guild
     *  
    */
    public addGuild = (guild: Guild) => new Promise(async (res, rej) => {
        try {
            await this.pQuery(
                `
                INSERT INTO guilds (guild_id, channel_id, mc_server, setup_by, created_at, guild_name) 
                VALUES (?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE channel_id = "${guild.channel_id}", mc_server ="${guild.mc_server}", setup_by = "${guild.setup_by}", created_at = ${guild.created_at}
                `, [guild.guild_id, guild.channel_id, guild.mc_server, guild.setup_by, guild.created_at, guild.guild_name]
            )

            await client.syncGuildCache();
            res(true);

        } catch (err) {
            console.log("Error trying to add guild: " + err + " " + guild.guild_id);
            rej(false);
        }
    });

    /**
     * Remove a livechat from the database
     * @param guild_id 
     * @param channel_id 
     * @returns 
     */
    public removeLiveChat = (guild_id: string, channel_id?: string) => new Promise(async (res, rej) => {
        const query = {
            str: channel_id ? `DELETE FROM livechats WHERE guildID = ? AND channelID = ?` : `DELETE FROM livechats WHERE guildID = ?`,
            args: channel_id ? [guild_id, channel_id] : [guild_id]
        }

        try {
            await this.pQuery(query.str, query.args);
            res(true);
        }
        catch (err) {
            console.log("Error trying to remove livechat: " + err + " " + guild_id);
            rej(false);
        }

    })


    /**
     * Adding a livechat to database
     * @param args 
     * @returns 
     */
    public addLiveChat = (args: livechatArgs) => new Promise(async (res, rej) => {
        try {
            const results = await this.pQuery("SELECT * FROM livechats WHERE guildID = ?", [args.guild_id])
            
            //livechat exists in this channel
            if (results["channelID"] === args.channel_id) return res(false);
            //livechat exists with this mc_server
            if (results["mc_server"] === args.mc_server) return res(false);

            await this.pQuery(
                "INSERT INTO livechats (guildName,guildID,channelID,setupBy,date,mc_server) VALUES(?,?,?,?,?,?)",
                [args.guild_name, args.guild_id, args.channel_id, args.setup_by, args.created_at, args.mc_server]
            )

            res(true);

        } catch (err) {
            console.log("Error trying to add livechat: " + err + " " + args.guild_id);
            rej(false);
        }
    })

}