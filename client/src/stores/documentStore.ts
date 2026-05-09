import { create } from 'zustand'

// Auto-save timeout reference (outside the store)
let autoSaveTimeout: ReturnType<typeof setTimeout> | null = null


// shape of state
interface DocumentState {
    documentId: string | null
    title: string
    content: string
    lastSaved: Date | null
    isSaving: boolean

    // autosave fields
    autoSaveEnabled: boolean
    saveStatus: 'saved' | 'saving' | 'unsaved' | 'error'

    // actions
    setDocumentId: (id: string | null) => void
    setTitle: (title: string) => void
    setContent: (content: string) => void
    saveDocument: () => Promise<void>
    loadDocument: (id: string) => Promise<void>

    // autosave actions
    enableAutoSave: () => void
    disableAutoSave: () => void
    triggerAutoSave: () => void
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
    documentId: null,
    title: '',
    content: '',
    lastSaved: null,
    isSaving: false,

    // NEW: Auto-save state
    autoSaveEnabled: false,
    saveStatus: 'saved',

 
    // actions
    setDocumentId: (id) => set({ documentId: id }),
    setTitle: (title) => {
        set({ title })
        console.log("title: " + title);
        // trigger autosave when title changes
        get().triggerAutoSave()
    },
    // this is triggered every time content is changed. assuming it uses hooks or something.
    setContent: (content) => {
        set({ content })
        // trigger autosave when content changes
        console.log("content: " + content);
        get().triggerAutoSave()
    },
 
    saveDocument: async () => {
        const { documentId, title, content } = get()
        
        if (!documentId) {
            // Create new document first
            // const newDoc = await createDocument({ title, content })
            // set({ documentId: newDoc.id })
            return
        }
 
        set({ saveStatus: 'saving' })
        try {
            // await updateDocument(documentId, { title, content })
            set({ 
                lastSaved: new Date(),
                saveStatus: 'saved' 
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
    },

    // NEW: Auto-save actions
    enableAutoSave: () => set({ autoSaveEnabled: true }),
    
    disableAutoSave: () => {
        set({ autoSaveEnabled: false })
        if (autoSaveTimeout) {
            clearTimeout(autoSaveTimeout)
            autoSaveTimeout = null
        }
    },

    triggerAutoSave: () => {
        const { autoSaveEnabled, isSaving } = get()
        
        // Don't auto-save if disabled or already saving
        if (!autoSaveEnabled || isSaving) return
        
        // Clear any existing auto-save timeout
        if (autoSaveTimeout) {
            clearTimeout(autoSaveTimeout)
        }
        
        // Set status to unsaved immediately
        set({ saveStatus: 'unsaved' })
        
        // Schedule save after 1 second of inactivity
        autoSaveTimeout = setTimeout(async () => {
            try {
                await get().saveDocument()
                set({ saveStatus: 'saved' })
            } catch (error) {
                set({ saveStatus: 'error' })
                console.error('Auto-save failed:', error)
            }
        }, 1000)
    },

}))
