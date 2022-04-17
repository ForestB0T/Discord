import { cnf, color } from "../../index.js";
import makeid from "../makeId.js";

const makeTablistEmbed = (mc_server: string, custom_id: string) => {
    let tablisturl = `${cnf.apiUrl}/tab/${mc_server}?${makeid(14)}`;

    return {
        embeds: [{
            color: color.Green,
            title: `**${mc_server}**`,
            image: { url: tablisturl },
            timestamp: new Date(),
            footer: {
                text: `${cnf.apiUrl}`
            }
        }],
        components: [{
            type: 1,
            components: [
                {
                    type: 2,
                    style: 3,
                    label: "Refresh",
                    custom_id: custom_id
                }
            ]
        }]
    }

}

export default makeTablistEmbed