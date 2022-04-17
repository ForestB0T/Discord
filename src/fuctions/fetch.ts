import fetch from 'node-fetch';

const fetchData = async (url: string) => await (await fetch(url)).json()

export default fetchData