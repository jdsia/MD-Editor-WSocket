import { useEffect, useRef, useCallback } from 'react';
import { WsMessage } from '../../../shared/types/ws-messages';

export function useCollabSocket(
    documentId: string,
    userId: string,
    onRemoteMessage?: (message: WsMessage) => void
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
                    case 'cursor-position':
                    case 'user-joined':
                    case 'room-joined':
                        if (onRemoteMessage) {
                            onRemoteMessage(message);
                        }
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
    }, [documentId, userId, onRemoteMessage]);

    const sendUpdate = useCallback((type: 'document-update' | 'cursor-position', content: any) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            const updateMessage: WsMessage = {
                type: type as any, // Cast to avoid TS error
                documentId: documentId,
                content: content,
                userId: userId, // Some types require userId
                position: 0 // Dummy value to satisfy old cursor-position type
            } as WsMessage;

            socketRef.current.send(JSON.stringify(updateMessage));
        }
    }, [documentId, userId]);

    return { sendUpdate };
}
