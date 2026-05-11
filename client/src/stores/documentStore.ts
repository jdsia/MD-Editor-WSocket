import { create } from 'zustand'
import { documentApi } from '../api/documents'

// Auto-save timeout reference (outside the store)
let autoSaveTimeout: ReturnType<typeof setTimeout> | null = null


// shape of state
interface DocumentState {
    documentId: string | null
    title: string
    content: any // TipTap JSON object
    lastSaved: Date | null
    isSaving: boolean

    // autosave fields
    autoSaveEnabled: boolean
    saveStatus: 'saved' | 'saving' | 'unsaved' | 'error'

    // actions
    setDocumentId: (id: string | null) => void
    setTitle: (title: string) => void
    setContent: (content: any) => void // TipTap JSON object
    saveDocument: () => Promise<void>
    loadDocument: (id: string) => Promise<void>

    // autosave actions
    enableAutoSave: () => void
    disableAutoSave: () => void
    triggerAutoSave: () => void

    //document list
    documents: Array<{id: string, title: string, updated_at: string}>
    loadAllDocuments: () => Promise<void>
    selectDocument: (id: string) => void
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
    documentId: null,
    title: '',
    content: { type: 'doc', content: [] }, // TipTap empty document
    lastSaved: null,
    isSaving: false,

    // NEW: Auto-save state
    autoSaveEnabled: false,
    saveStatus: 'saved' as const,

    // document list
    documents: [],

 
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
        console.log("content:", JSON.stringify(content));
        get().triggerAutoSave()
    },
 
    saveDocument: async () => {
        const { documentId, title, content } = get()
        console.log('saveDocument called:', { documentId, title, content: JSON.stringify(content).substring(0, 50) + '...' })
        
        set({ saveStatus: 'saving' })
        try {
            let result 
            if (!documentId) {
                console.log('Creating new document...')
                result = await documentApi.create({ title, content })
                console.log('Create result:', result)
                set({ documentId: result.id, saveStatus: 'saved', lastSaved: new Date(result.updated_at) })
            } else {
                console.log('Updating document:', documentId)
                result = await documentApi.update(documentId, { title, content })
                console.log('Update result:', result)
                set({ saveStatus: 'saved', lastSaved: new Date(result.updated_at)})
            }
        } catch (error) {
            console.error('Save failed:', error)
            set({ saveStatus: 'error' })
        }
    },
 
    loadDocument: async (id: string) => {
        set({ saveStatus: 'saving' })

        try {
            // had to use await. Because the api returns a PROMISE not actual docs.
            // doc is a promise object.
            const doc = await documentApi.get(id)

            set ({
                documentId: doc.id,
                title: doc.title,
                content: doc.content, // This is now markdown string
                lastSaved: new Date(doc.updated_at),
                saveStatus: 'saved'
            })
        } catch (error) {
            set({ saveStatus: 'error' })
            console.error('Load failed', error)
        }

    },

    loadAllDocuments: async () => {
        const docs = await documentApi.getAll()
        set({ documents: docs })
    },

    selectDocument: async (id: string) => {
        await get().loadDocument(id)
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
        const { autoSaveEnabled, saveStatus} = get()
        console.log('triggerAutoSave called:', { autoSaveEnabled, saveStatus })
        
        // Don't auto-save if disabled or already saving
        if (!autoSaveEnabled || saveStatus === 'saving') {
            console.log('Auto-save blocked: autoSaveEnabled=', autoSaveEnabled, 'saveStatus=', saveStatus)
            return
        }
        
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
                //set({ saveStatus: 'saved' })
            } catch (error) {
                set({ saveStatus: 'error' })
                console.error('Auto-save failed:', error)
            }
        }, 1000)
    },

}))
