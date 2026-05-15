// shared/types/ws-messages.ts

export type WsMessage =
    | { type: 'join-room'; documentId: string; userId: string; color?: string }
    | { type: 'leave-room'; documentId: string; userId: string }
    | { type: 'document-update'; documentId: string; content: any } // (or delta, depending on your setup)
    | { type: 'cursor-position'; documentId: string; userId: string; position: number }
    | { type: 'user-joined'; userId: string; color?: string }
    | { type: 'user-left'; userId: string };
