import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useCallback } from "react";
import { useDocumentStore } from "../../stores/documentStore";
import { useCollabSocket } from "../../hooks/useCollabSocket";

const DEMO_DOCUMENT_ID = "my-collab-document";
const DEMO_USER_ID = "user-" + Math.floor(Math.random() * 1000);


export function Editor() {
    const { content, setContent } = useDocumentStore();

    const handleRemoteUpdate = useCallback((newContent: any) => {
        setContent(newContent)
    }, [setContent])

    const { sendUpdate } = useCollabSocket(DEMO_DOCUMENT_ID, DEMO_USER_ID, handleRemoteUpdate);


    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: '', // Start empty
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            // Save content as TipTap JSON format
            const jsonContent = editor.getJSON()
            if (JSON.stringify(jsonContent) !== JSON.stringify(content)) {
                setContent(jsonContent)
                sendUpdate(jsonContent)
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
