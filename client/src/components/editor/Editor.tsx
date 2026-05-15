import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useCallback, useRef, useMemo, useState } from "react";
import { useDocumentStore } from "../../stores/documentStore";
import { useCollabSocket } from "../../hooks/useCollabSocket";
import { useAuthStore } from "../../stores/authStore";

// yjs 
import * as Y from 'yjs'
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

// We must create an Awareness instance manually since we aren't using a pre-built provider
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from 'y-protocols/awareness'

export function Editor() {
    const { content, setContent, documentId } = useDocumentStore();
    const { user } = useAuthStore();

    const { ydoc, awareness } = useMemo(() => {
        const doc = new Y.Doc();
        return { ydoc: doc, awareness: new Awareness(doc) };
    }, [documentId]);

    const sendUpdateRef = useRef<any>(null);

    const handleRemoteMessage = useCallback((message: any) => {
        console.log("RECEIVED REMOTE MESSAGE:", message.type, "Bytes:", message.content?.length);
        if (message.type === 'document-update') {
            const update = new Uint8Array(message.content);
            Y.applyUpdate(ydoc, update, 'remote');
        } else if (message.type === 'cursor-position') {
            const update = new Uint8Array(message.content);
            applyAwarenessUpdate(awareness, update, 'remote');
        } else if (message.type === 'user-joined') {
            // A new user joined! They don't have our CRDT history yet.
            // Send them the FULL document state and our cursor!
            if (sendUpdateRef.current) {
                const fullState = Y.encodeStateAsUpdate(ydoc);
                sendUpdateRef.current('document-update', Array.from(fullState));
                
                const awarenessState = encodeAwarenessUpdate(awareness, [awareness.clientID]);
                sendUpdateRef.current('cursor-position', Array.from(awarenessState));
            }
        } else if (message.type === 'room-joined') {
            // The server just told us how many people are in the room
            setRoomCount(message.count);
        }
    }, [ydoc, awareness])

    const { sendUpdate } = useCollabSocket(documentId || '', user?.id || 'anon', handleRemoteMessage)

    useEffect(() => {
        sendUpdateRef.current = sendUpdate;
    }, [sendUpdate]);

    // Listen to Yjs directly for changes, and broadcast them
    useEffect(() => {
        // 1. Sync Document Text
        const handleYjsUpdate = (update: Uint8Array, origin: any) => {
            if (origin !== 'remote') {
                const updateArray = Array.from(update);
                console.log("SENDING DOCUMENT UPDATE. Bytes:", updateArray.length);
                sendUpdate('document-update', updateArray); 
            }
        }
        ydoc.on('update', handleYjsUpdate);

        // 2. Sync Cursors (Awareness)
        const handleAwarenessUpdate = ({ added, updated, removed }: any, origin: any) => {
            if (origin !== 'remote') {
                const changedClients = added.concat(updated, removed);
                const update = encodeAwarenessUpdate(awareness, changedClients);
                const updateArray = Array.from(update);
                sendUpdate('cursor-position', updateArray);
            }
        }
        awareness.on('update', handleAwarenessUpdate);

        return () => {
            ydoc.off('update', handleYjsUpdate);
            awareness.off('update', handleAwarenessUpdate);
        }
    }, [sendUpdate])

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                undoRedo: false,
            }),
            Collaboration.configure({
                document: ydoc
            }),
            CollaborationCursor.configure({
                provider: { awareness },
                user: { name: user?.email || 'Anonymous', color: '#ffcc00' }
            })
        ],
        editorProps: {
            attributes: {
                style: 'min-height: calc(100vh - 150px); outline: none;'
            }
        },
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            // Keep Zustand updated so that database auto-save still works!
            setContent(editor.getJSON())
        },
    })


    const [roomCount, setRoomCount] = useState<number | null>(null);

    // We must manually inject the initial content from Supabase into Yjs!
    const isLoadedRef = useRef(false);

    useEffect(() => {
        // Reset our loaded flag whenever we switch documents
        isLoadedRef.current = false;
        setRoomCount(null);
    }, [documentId]);

    useEffect(() => {
        // Only proceed if editor is ready, content from DB is loaded, and we know our room count
        if (editor && content !== undefined && !isLoadedRef.current && roomCount !== null) {
            
            // If we are the FIRST person in the room, we MUST inject the database text into Yjs
            if (roomCount === 1) {
                if (content && typeof content === 'object' && content.type === 'doc') {
                    editor.commands.setContent(content);
                } else {
                    editor.commands.setContent('<p></p>');
                }
            } 
            // If roomCount > 1, DO NOT INJECT DATABASE TEXT!
            // We wait for the existing clients to send us the full Yjs state via 'document-update'!

            isLoadedRef.current = true;
        }
    }, [editor, content, roomCount]);

    return <EditorContent editor={editor} />
}
