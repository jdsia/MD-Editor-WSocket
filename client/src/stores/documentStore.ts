import { create } from 'zustand'

// shape of state
interface DocumentState {
    documentId: string | null
    title: string
    content: string
    lastSaved: Date | null
    isSaving: boolean

    // autosave fields

    // actions
    setDocumentId: (id: string | null) => void
    setTitle: (title: string) => void
    setContent: (content: string) => void
    saveDocument: () => Promise<void>
    loadDocument: (id: string) => Promise<void>
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
    documentId: null,
    title: '',
    content: '',
    lastSaved: null,
    isSaving: false,
 
    setDocumentId: (id) => set({ documentId: id }),
    setTitle: (title) => set({ title }),
    setContent: (content) => set({ content }),
 
    saveDocument: async () => {
        const { documentId, title, content } = get()
        
        if (!documentId) {
            // Create new document first
            // const newDoc = await createDocument({ title, content })
            // set({ documentId: newDoc.id })
            return
        }
 
        set({ isSaving: true })
        try {
            // await updateDocument(documentId, { title, content })
            set({ 
                lastSaved: new Date(),
                isSaving: false 
            })
        } catch (error) {
            set({ isSaving: false })
            throw error
        }
    },
 
    loadDocument: async (id) => {
        set({ isSaving: true })
        try {
            // const doc = await fetchDocument(id)
            // set({
            //     documentId: doc.id,
            //     title: doc.title,
            //     content: doc.content,
            //     lastSaved: doc.lastSaved,
            //     isSaving: false
            // })
        } catch (error) {
            set({ isSaving: false })
            throw error
        }
    }
}))
