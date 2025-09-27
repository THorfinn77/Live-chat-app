#!/usr/bin/env node

const os = require('os');

function getNetworkInfo() {
  const interfaces = os.networkInterfaces();
  const networkInfo = [];

  console.log('\n🔧 QuantumChat - Testing Fixed Configuration\n');
  console.log('═══════════════════════════════════════════════\n');

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

  console.log('✅ FIXES APPLIED:');
  console.log('   • Auto-detecting server URL for cross-device support');
  console.log('   • Fixed username handling and user management');
  console.log('   • Added connection status indicators');
  console.log('   • Server now binds to 0.0.0.0 for network access');
  console.log('   • Improved error handling and debugging\n');

  console.log('📱 CROSS-DEVICE ACCESS:');
  networkInfo.forEach((info, index) => {
    console.log(`   ${index + 1}. http://${info.ip}:5173`);
    console.log(`      Server: http://${info.ip}:5000`);
    console.log(`      Interface: ${info.interface}\n`);
  });

  console.log('🚀 HOW TO TEST:');
  console.log('   1. Start server: cd server && node index.js');
  console.log('   2. Start client: cd client && npm run dev');
  console.log('   3. On laptop 1: Use http://localhost:5173');
  console.log('   4. On laptop 2: Use http://192.168.1.10:5173');
  console.log('   5. Join same room on both devices');
  console.log('   6. Test messaging between devices\n');

  console.log('🔍 DEBUGGING:');
  console.log('   • Check browser console for connection status');
  console.log('   • Look for "✅ Connected to server" message');
  console.log('   • Verify server URL is correct in header');
  console.log('   • Ensure both devices on same WiFi network\n');

  console.log('📋 TROUBLESHOOTING:');
  console.log('   • If messages not sending: Check connection status');
  console.log('   • If username issues: Clear browser cache');
  console.log('   • If cross-device fails: Verify IP addresses');
  console.log('   • If server errors: Check port 5000 is free\n');
}

getNetworkInfo();
