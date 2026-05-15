import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useCallback, useRef } from "react";
import { useDocumentStore } from "../../stores/documentStore";
import { useCollabSocket } from "../../hooks/useCollabSocket";
import { useAuthStore } from "../../stores/authStore";



export function Editor() {
    const { content, setContent, documentId } = useDocumentStore();
    const { user } = useAuthStore();

    const handleRemoteUpdate = useCallback((newContent: any) => {
        setContent(newContent)
    }, [setContent])

    const { sendUpdate } = useCollabSocket(documentId || '', user?.id || 'anon', handleRemoteUpdate)

    // Bulletproof refs to prevent stale closures and infinite ping-pong loops
    const contentRef = useRef(content);
    const sendUpdateRef = useRef(sendUpdate);
    
    useEffect(() => {
        contentRef.current = content;
    }, [content]);

    useEffect(() => {
        sendUpdateRef.current = sendUpdate;
    }, [sendUpdate]);

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        editorProps: {
            attributes: {
                style: 'min-height: calc(100vh - 150px); outline: none;'
            }
        },
        content: '', // Start empty
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const jsonContent = editor.getJSON()
            // Compare with the LATEST content to prevent echo loops
            if (JSON.stringify(jsonContent) !== JSON.stringify(contentRef.current)) {
                setContent(jsonContent)
                sendUpdateRef.current(jsonContent)
            }
        },
    })
    //
    //    useEffect(() => {
    //        if (editor && content !== undefined) {
    //            //    // Handle TipTap JSON content
    //            //    if (content && typeof content === 'object' && content.type === 'doc') {
    //            //        // Set content as TipTap JSON
    //            //        editor.commands.setContent(content)
    //            //    } else {
    //            //        // Set empty paragraph for empty content
    //            //        editor.commands.setContent('<p></p>')
    //            //    }
    //            //}
    //
    //            // Check if it's actually different to prevent cursor jumping
    //            const currentEditorContent = editor.getJSON();
    //            if (JSON.stringify(currentEditorContent) !== JSON.stringify(content)) {
    //                if (content && typeof content === 'object' && content.type === 'doc') {
    //                    // Pass `false` as the second argument to prevent infinite loops!
    //                    editor.commands.setContent(content, false)
    //                } else {
    //                    editor.commands.setContent('<p></p>', false)
    //                }
    //            }
    //        }
    //    }, [content, editor])

    useEffect(() => {
        if (editor && content !== undefined) {
            // Check if it's actually different to prevent cursor jumping
            const currentEditorContent = editor.getJSON();

            if (JSON.stringify(currentEditorContent) !== JSON.stringify(content)) {

                if (content && typeof content === 'object' && content.type === 'doc') {
                    // Pass `false` as the second argument to prevent infinite loops!
                    editor.commands.setContent(content, { emitUpdate: false })
                } else {
                    editor.commands.setContent('<p></p>', { emitUpdate: false })
                }

            }
        }
    }, [content, editor])


    return <EditorContent editor={editor} />
}
