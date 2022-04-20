export const convertUnixTimestamp = (time: number) => {
    const date = new Date(time * 1000);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = 0 + date.getMinutes();
    const seconds = 0 + date.getSeconds();
    return `${month} ${day} ${year} ${hours}:${minutes}:${seconds}`;
}