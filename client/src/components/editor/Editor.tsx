import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect } from "react";
import { useDocumentStore } from "../../stores/documentStore";

export function Editor() {
    const { content, setContent } = useDocumentStore();

    const editor = useEditor({
        extensions: [StarterKit],
        content: '', // Start empty
        onUpdate: ({ editor }) => {
            const newContent = editor.getJSON()
            setContent(newContent)
        },
        immediatelyRender: false,
    })

    useEffect(() => {
        if (editor) {
            console.log('Content type:', typeof content, content)
            console.log('Content stringified:', JSON.stringify(content, null, 2))
            
            // Try different content formats
            if (typeof content === 'string') {
                try {
                    const parsed = JSON.parse(content)
                    console.log('Parsed content:', parsed)
                    editor.commands.setContent(parsed)
                } catch (e) {
                    console.log('Content is not valid JSON, trying as plain text')
                    editor.commands.setContent('<p>' + content + '</p>')
                }
            } else if (content && typeof content === 'object') {
                console.log('Content is object, setting directly')
                editor.commands.setContent(content)
            } else {
                console.log('Content is empty or invalid, setting empty content')
                editor.commands.setContent('<p></p>')
            }
        }
    }, [content, editor])

    return <EditorContent editor = {editor} />
}
