// Production configuration for cross-WiFi chat
const config = {
  // Development server (local)
  development: {
    serverUrl: "http://localhost:5000",
    clientUrl: "http://localhost:5173"
  },
  
  // Production server (deployed)
  production: {
    serverUrl: "https://live-chat-app-finale.onrender.com",
    clientUrl: "https://live-chat-fasvtpdgg-thorfinns-projects-edbf0f6d.vercel.app"
  }
};

// Auto-detect environment
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('192.168.') ||
                     window.location.hostname.includes('10.0.') ||
                     window.location.hostname.includes('172.');

const currentConfig = isDevelopment ? config.development : config.production;

export default currentConfig;
