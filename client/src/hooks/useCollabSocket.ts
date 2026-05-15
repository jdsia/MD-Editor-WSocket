import { useEffect, useRef, useCallback } from 'react';
import { WsMessage } from '../../../shared/types/ws-messages';

export function useCollabSocket(
    documentId: string,
    userId: string,
    onRemoteUpdate?: (content: any) => void
) {
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {

        // dont connect if we dont have a document id
        if (!documentId) return;
        // Initialize the WebSocket connection
        const ws = new WebSocket('ws://localhost:3001');
        socketRef.current = ws;

        ws.onopen = () => {
            console.log('Connected to collab server');

            // Construct and send the join-room message
            const joinMessage: WsMessage = {
                type: 'join-room',
                documentId: documentId,
                userId: userId,
                // color: '#ff0000' // You can generate random colors here later!
            };

            ws.send(JSON.stringify(joinMessage));
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data) as WsMessage;

                switch (message.type) {
                    case 'document-update':
                        // When we receive an update from the server, 
                        // pass it up to the Editor component if the callback exists
                        if (onRemoteUpdate) {
                            onRemoteUpdate(message.content);
                        }
                        break;

                    case 'user-joined':
                        console.log("User joined:", message.userId);
                        break;

                    case 'user-left':
                        console.log("User left:", message.userId);
                        break;
                }
            } catch (err) {
                console.error("Failed to parse message", err);
            }
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [documentId, userId, onRemoteUpdate]);

    // Helper function for the Editor to call when the user types
    const sendUpdate = useCallback((content: any) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {

            // Construct and send the document-update message
            const updateMessage: WsMessage = {
                type: 'document-update',
                documentId: documentId,
                content: content
            };

            socketRef.current.send(JSON.stringify(updateMessage));
        }
    }, [documentId]);

    return { sendUpdate };
}
