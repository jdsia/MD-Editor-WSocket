import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import { useEffect } from "react";
import { useDocumentStore } from "../../stores/documentStore";
import TurndownService from "turndown";


// Create turndown service for HTML to markdown conversion
const turndownService = new TurndownService({
    headingStyle: 'atx', // Use # headings instead of <h1> tags
    codeBlockStyle: 'fenced', // Use ``` for code blocks
});

export function Editor() {
    const { content, setContent } = useDocumentStore();


    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown.configure({
                markedOptions: {
                    gfm: true,
                    breaks: true,
                },
            })
        ],
        content: '', // Start empty
        onUpdate: ({ editor }) => {
            // Convert rich text to markdown for storage
            const htmlContent = editor.getHTML()
            const markdownContent = turndownService.turndown(htmlContent)
            if (markdownContent !== content) {
                setContent(markdownContent)
            }
        },
        immediatelyRender: false,
    })

    useEffect(() => {
        if (editor) {
            // Get current editor content to compare
            const currentMarkdown = turndownService.turndown(editor.getHTML())
            
            // Only update if content is different
            if (currentMarkdown !== content) {
                if (typeof content === 'string' && content.trim()) {
                    editor.commands.setContent(content)
                } else {
                    editor.commands.setContent('<p></p>')
                }
            }
        }
    }, [content, editor])

    return <EditorContent editor = {editor} />
}
