import axios from "axios"

export const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
        'Content-Type': 'application/json',
        // Adicione outros headers necessários, como autorização, se necessário
      }
})