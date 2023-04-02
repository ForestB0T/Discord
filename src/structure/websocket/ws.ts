import WebSocket from "ws";
import { client } from "../../index.js";

interface WebSocketInMessage {
    action: "chat";
    data: any,
    type?: "chat"|"death"|"advancement",
    mcServer: string
};

interface WebSocketOutMessage {
    action: "chat";
    data: any,
    type?: "discord",
    mcServer: string
};

interface MinecraftCharArgs {
    name: string,
    message: string,
    mc_server: string
}

type MinecraftChatAdvancement = {
    username: string,
    advancement: string,
    time: number,
    mc_server: string
}

interface MinecraftPlayerDeath {
    victim?: string,
    death_message: string,
    murderer?: string,
    time: number,
    type: "pve"|"pvp",
    mc_server: string
}

interface MinecraftPlayerJoin {
    user: string,
    uuid: string,
    mc_server: string,
    time: string
}

interface MinecraftPlayerLeaveArgs {
    username: string,
    mc_server: string,
    time: string
}

export default class WebSocketHandler {

    private ws: WebSocket;

    constructor(private readonly url: string) {

        this.connect();
    }

    public connect() {
        this.ws = new WebSocket(this.url, {
            headers: {
                'x-api-key': process.env.apikey,
                "client-type": "discord",
                "client-id": `main-bot`
            }
        });

        this.ws.on('open', () => {
            console.log('WebSocket connection established');
            setInterval(() => {
                this.ws.ping();
            }, 5000)
        });

        this.ws.on('close', (reason) => {
            console.log('WebSocket connection closed ', reason);
            setTimeout(() => { this.connect() }, 10000)
        });

        this.ws.on('message', async (data: any) => {
            const message = JSON.parse(data) as WebSocketInMessage;
            
            if (message.type === "chat") {
                const { name, message: content, mc_server } =  message.data as MinecraftCharArgs
                await client.minecraftChatEmbed(`**${name}** » ${content}`, "gray", mc_server);
                return;  
            }

            if (message.type === "advancement") {
                const { username, advancement, mc_server, time } = message.data as MinecraftChatAdvancement
                await client.minecraftChatEmbed(advancement, "Yellow", mc_server);
                return;
            }

            if (message.type === "death") {
                const { death_message, mc_server } = message.data as MinecraftPlayerDeath;
                await client.minecraftChatEmbed(death_message, "Indigo", mc_server);
                return;
            }   

            if (message.type === "join") {
                const { mc_server, time, user, uuid } = message.data as MinecraftPlayerJoin;
                await client.minecraftChatEmbed(`${user} joined.`, "Green", mc_server);
                return;
            }

            if (message.type === "leave") {
                const { mc_server, username } = message.data as MinecraftPlayerLeaveArgs;
                await client.minecraftChatEmbed(`${username} left.`, "red", mc_server);
                return;
            }

        });

        this.ws.on('error', (error: Error) => {
            console.log(`WebSocket connection error: ${error.message}`);
        });
    }

    public send(message: WebSocketOutMessage): void {
        this.ws.send(JSON.stringify(message));
    }


}