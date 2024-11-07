import axios from 'axios'

const baseUrl = 'localhost:4000'

export const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    }
})