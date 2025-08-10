// api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://whatsapp-backend-rhrf.onrender.com',
});

export default API;
