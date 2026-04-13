import axios from 'axios';

// Automatically choose the correct database address depending on the device:
// - Computer Browser uses pure 'localhost' (perfectly bypasses any firewalls)
// - Android Phone uses your Wi-Fi IP '10.40.121.210' (needed for mobile networks)
const isMobileApp = !!window.Capacitor;

const api = axios.create({
  baseURL: isMobileApp ? 'http://10.40.121.210:3001/api' : 'http://localhost:3001/api',
});

export default api;
