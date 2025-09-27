#!/usr/bin/env node

const os = require('os');

function getNetworkInfo() {
  const interfaces = os.networkInterfaces();
  const networkInfo = [];

  console.log('\n🚀 QuantumChat Network Information\n');
  console.log('═══════════════════════════════════════\n');

  Object.keys(interfaces).forEach(name => {
    const iface = interfaces[name];
    iface.forEach(alias => {
      if (alias.family === 'IPv4' && !alias.internal) {
        networkInfo.push({
          interface: name,
          ip: alias.address,
          mac: alias.mac
        });
      }
    });
  });

  if (networkInfo.length === 0) {
    console.log('❌ No network interfaces found');
    return;
  }

  console.log('📱 To access from other devices on your network:');
  console.log('   Use these URLs instead of localhost:\n');

  networkInfo.forEach((info, index) => {
    console.log(`   ${index + 1}. http://${info.ip}:5173`);
    console.log(`      Interface: ${info.interface}`);
    console.log(`      MAC: ${info.mac}\n`);
  });

  console.log('📋 Instructions:');
  console.log('   1. Make sure your devices are on the same WiFi network');
  console.log('   2. Use the IP address above instead of localhost');
  console.log('   3. Join the same room name on all devices');
  console.log('   4. Start chatting across devices! 🎉\n');

  console.log('🔧 Server Configuration:');
  console.log('   • Server runs on port 5000');
  console.log('   • Client runs on port 5173');
  console.log('   • CORS enabled for all origins');
  console.log('   • Real-time messaging with Socket.IO\n');
}

getNetworkInfo();

