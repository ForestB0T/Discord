import TimeAgo           from 'javascript-time-ago';
import { createRequire } from "module"; 
const require = createRequire(import.meta.url); 
const en = require('javascript-time-ago/locale/en.json') 

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US');


export const convertUnixTimestamp = (time: number) => {

    if (Math.abs(Date.now() - time) < Math.abs(Date.now() - time * 1000)) {
        time = time;
     } else {
        time = time * 1000;
     }
    
    const date = new Date(time);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = 0 + date.getMinutes();
    const seconds = 0 + date.getSeconds();
    return `${month} ${day} ${year} ${hours}:${minutes}:${seconds}`;
}


    /**
     * Takes in a timestamp and returns a readable time ago string
     * example:
     * ### 1 minute ago
     * ### 2 hours ago
     * ### 3 days ago
     * @param time 
     * @returns string
     */
export const timeAgoStr = (time: number) => {
    return timeAgo.format(time)
}