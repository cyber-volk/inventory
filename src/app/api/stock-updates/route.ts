import { WebSocketServer } from '../../../lib/ws';

const wss = new WebSocketServer({
    port: parseInt(process.env.WS_PORT || '3001')
});

wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
        // Your message handling logic here
    });
});
