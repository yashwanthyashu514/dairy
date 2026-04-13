import axios from 'axios';

// Automatically connect to the Render production server
const api = axios.create({
  baseURL: 'https://tejas-backend-a2dj.onrender.com/api',
});

export default api;
