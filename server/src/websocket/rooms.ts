import { WebSocket } from 'ws';

// 1. Define what a Client looks like
export interface Client {
    socket: WebSocket;
    userId: string;
    documentId: string;
    color?: string; // We can use this later for cursor colors!
}

// 2. The core state: A Map where the key is the documentId, 
// and the value is a Set of connected Clients.
// A Set is great here because it guarantees uniqueness (a client can't be in a room twice)
const rooms = new Map<string, Set<Client>>();

// 3. Helper functions

export function joinRoom(documentId: string, client: Client): number {
    // check if we alr have a room for doc
    if (!rooms.has(documentId)) {
        // if not, initialize new empty set for this documentId
        rooms.set(documentId, new Set<Client>());
    }

    // 3. Get the Set for this room and add the client to it
    // We use the '!' non-null assertion because we just guaranteed the room exists above
    const room = rooms.get(documentId)!;
    room.add(client);
    return room.size;
}

export function leaveRoom(documentId: string, client: Client) {
    const room = rooms.get(documentId);

    if (room) {
        // remove this specific client from the set
        room.delete(client)

        // if this was the last person in the room
        // delete room entirely so we don't leak mem over time
        if (room.size === 0) {
            rooms.delete(documentId);
        }
    }
}

export function broadcastToRoom(documentId: string, sender: Client, message: any) {
    // TODO: Get the room from the map.
    // Iterate through all clients in the room.
    // If the client is NOT the sender, and the client's socket is OPEN, 
    // send the message to them.

    const room = rooms.get(documentId)

    if (room) {
        // convert js obj message into json string. 
        // websockets can only send strings or binary
        const messageString = JSON.stringify(message)

        // only send if client is NOT sender. 
        // socket is fully OPEN
        for (const client of room) {
            if (client !== sender && client.socket.readyState === WebSocket.OPEN) {
                client.socket.send(messageString);
            }

        }
    }
}
