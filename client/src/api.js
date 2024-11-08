import axios from 'axios'

const baseUrl = 'http://4.203.106.105:4000/'

export const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    }
})