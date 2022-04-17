import { createPool, Pool, PoolConfig } from "mysql";

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

    public pQuery = (query: string, args?: any[]) => new Promise((resolve, reject) => this.database.query(
        query,
        args,
        (err, res) => {
            if (err) return reject(err)
            return resolve(res);
        }
    ))

    public async getGuilds(): Promise<Guild[]> {
        const res = await this.pQuery(`SELECT * FROM guilds`) as Guild[];
        return res;
    }

}