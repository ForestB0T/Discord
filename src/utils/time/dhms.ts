
export const dhms = (t: number): string => {
    const d = Math.floor(t / (1000 * 60 * 60 * 24));
    const h = Math.floor(t % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    const m = Math.floor(t % (1000 * 60 * 60) / (1000 * 60));
    return `${d} day(s) ${h} hours ${m} minutes`;
}