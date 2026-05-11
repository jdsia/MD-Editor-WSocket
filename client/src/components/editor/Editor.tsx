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
            // Save HTML content directly for now (no markdown conversion)
            const htmlContent = editor.getHTML()
            if (htmlContent !== content) {
                setContent(htmlContent)
            }
        },
    })

    useEffect(() => {
        if (editor && content !== undefined) {
            // Handle markdown content - treat everything as markdown string
            if (typeof content === 'string' && content.trim()) {
                // Set content as markdown - TipTap will parse it automatically
                editor.commands.setContent(content)
            } else {
                // Set empty paragraph for empty content
                editor.commands.setContent('<p></p>')
            }
        }
    }, [content, editor])

    return <EditorContent editor = {editor} />
}
