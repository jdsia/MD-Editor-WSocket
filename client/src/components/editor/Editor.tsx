import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect } from "react";
import { useDocumentStore } from "../../stores/documentStore";

export function Editor() {
    const { content, setContent } = useDocumentStore();

    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        onUpdate: ({ editor }) => {
            const newContent = editor.getJSON()
            setContent(newContent)
        },
        immediatelyRender: false,
    })

    useEffect(() => {
        if (editor && JSON.stringify(content) !== JSON.stringify(editor.getJSON())) {
            try {
                editor.commands.setContent(content)
            } catch (e) {
                editor.commands.setContent({ type: 'doc', content: [] })
            }
        }
    }, [content, editor])

    return <EditorContent editor = {editor} />
}
