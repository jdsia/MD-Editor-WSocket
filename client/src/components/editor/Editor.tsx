import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect } from "react";
import { useDocumentStore } from "../../stores/documentStore";

export function Editor() {
    const { content, setContent } = useDocumentStore();

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
            }
        },
    })

    useEffect(() => {
        if (editor && content !== undefined) {
            // Handle TipTap JSON content
            if (content && typeof content === 'object' && content.type === 'doc') {
                // Set content as TipTap JSON
                editor.commands.setContent(content)
            } else {
                // Set empty paragraph for empty content
                editor.commands.setContent('<p></p>')
            }
        }
    }, [content, editor])

    return <EditorContent editor = {editor} />
}
