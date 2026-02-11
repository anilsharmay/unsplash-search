import { spawn } from 'child_process';
import { createInterface } from 'readline';

// Use the key from environment or a dummy one for testing structure
const apiKey = process.env.UNSPLASH_ACCESS_KEY || 'dummy_key';

const server = spawn('node', ['index.js'], {
    env: { ...process.env, UNSPLASH_ACCESS_KEY: apiKey },
    stdio: ['pipe', 'pipe', 'inherit']
});

const rl = createInterface({ input: server.stdout });

let step = 0;

rl.on('line', (line) => {
    try {
        const msg = JSON.parse(line);

        // Handle log messages that might not be JSON-RPC (though SDK usually wraps them)
        if (!msg.jsonrpc) return;

        if (step === 0 && msg.id === 0) {
            console.log('✅ Server initialized');

            // Send initialized notification
            server.stdin.write(JSON.stringify({
                jsonrpc: '2.0',
                method: 'notifications/initialized'
            }) + '\n');

            // List tools to verify registration
            console.log('Listing tools...');
            server.stdin.write(JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'tools/list'
            }) + '\n');
            step = 1;
        } else if (step === 1 && msg.id === 1) {
            const toolNames = msg.result.tools.map(t => t.name);
            console.log('✅ Tools found:', toolNames.join(', '));

            if (toolNames.includes('search_photos')) {
                console.log('Calling search_photos with query "nature"...');
                server.stdin.write(JSON.stringify({
                    jsonrpc: '2.0',
                    id: 2,
                    method: 'tools/call',
                    params: {
                        name: 'search_photos',
                        arguments: { query: 'nature', per_page: 1 }
                    }
                }) + '\n');
                step = 2;
            } else {
                console.error('❌ search_photos tool not found!');
                process.exit(1);
            }
        } else if (step === 2 && msg.id === 2) {
            if (msg.error) {
                console.error('❌ Error from tool:', JSON.stringify(msg.error, null, 2));
            } else {
                const content = msg.result.content[0].text;
                try {
                    const data = JSON.parse(content);
                    if (data.length > 0) {
                        console.log('✅ Search successful!');
                        console.log(`Found photo: ${data[0].url}`);
                        console.log(`Description: ${data[0].description}`);
                    } else {
                        // Could be empty results or error message in text
                        console.log('⚠️ Response received:', content);
                    }
                } catch {
                    console.log('⚠️ Raw content received:', content);
                }
            }
            process.exit(0);
        }
    } catch (e) {
        // Ignore non-JSON lines (like debug output)
    }
});

// Start handshake
console.log('Starting server and sending initialize...');
server.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 0,
    method: 'initialize',
    params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'tester', version: '0.1' }
    }
}) + '\n');

// Timeout safety
setTimeout(() => {
    console.error('❌ Timeout waiting for response');
    server.kill();
    process.exit(1);
}, 10000);
