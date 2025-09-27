#!/usr/bin/env node

const http = require('http');
const net = require('net');

console.log('🧪 QuantumChat Connection Test');
console.log('═══════════════════════════════════════\n');

// Test server connection
function testServer() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/rooms',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            if (res.statusCode === 200) {
                console.log('✅ Server API is responding');
                resolve(true);
            } else {
                console.log('❌ Server API returned status:', res.statusCode);
                resolve(false);
            }
        });

        req.on('error', (err) => {
            console.log('❌ Server connection failed:', err.message);
            resolve(false);
        });

        req.setTimeout(5000, () => {
            console.log('❌ Server connection timeout');
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

// Test client connection
function testClient() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5173,
            path: '/',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            if (res.statusCode === 200) {
                console.log('✅ Client is responding');
                resolve(true);
            } else {
                console.log('❌ Client returned status:', res.statusCode);
                resolve(false);
            }
        });

        req.on('error', (err) => {
            console.log('❌ Client connection failed:', err.message);
            resolve(false);
        });

        req.setTimeout(5000, () => {
            console.log('❌ Client connection timeout');
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

// Test port availability
function testPort(port, service) {
    return new Promise((resolve) => {
        const server = net.createServer();
        
        server.listen(port, () => {
            server.once('close', () => {
                console.log(`❌ Port ${port} (${service}) is available but not in use`);
                resolve(false);
            });
            server.close();
        });
        
        server.on('error', () => {
            console.log(`✅ Port ${port} (${service}) is in use`);
            resolve(true);
        });
    });
}

async function runTests() {
    console.log('🔍 Testing port availability...');
    const serverPort = await testPort(5000, 'Server');
    const clientPort = await testPort(5173, 'Client');
    
    console.log('\n🌐 Testing HTTP connections...');
    const serverTest = await testServer();
    const clientTest = await testClient();
    
    console.log('\n📊 Test Results:');
    console.log('═══════════════════════════════════════');
    
    if (serverPort && serverTest) {
        console.log('✅ Server: FULLY OPERATIONAL');
    } else {
        console.log('❌ Server: ISSUES DETECTED');
    }
    
    if (clientPort && clientTest) {
        console.log('✅ Client: FULLY OPERATIONAL');
    } else {
        console.log('❌ Client: ISSUES DETECTED');
    }
    
    console.log('\n🎯 Ready for Testing:');
    if (serverPort && serverTest && clientPort && clientTest) {
        console.log('🚀 All systems are GO! QuantumChat is ready for testing.');
        console.log('\n📱 Test Instructions:');
        console.log('1. Open http://localhost:5173 in your browser');
        console.log('2. Enter a username and room name');
        console.log('3. Open another tab/window with the same URL');
        console.log('4. Join the same room and start chatting!');
        console.log('5. Try the network IP for mobile devices');
    } else {
        console.log('⚠️  Some issues detected. Check the logs and restart if needed.');
        console.log('\n🔧 Troubleshooting:');
        console.log('• Run: ./start-quantumchat.sh');
        console.log('• Check logs: server.log and client.log');
        console.log('• Ensure ports 5000 and 5173 are available');
    }
    
    console.log('\n═══════════════════════════════════════');
}

runTests();
