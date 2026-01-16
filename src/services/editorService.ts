type EditorDocument = {
  id: string
  title?: string
  content: string
  modifiedAt: number
}

type Listener = (doc: EditorDocument) => void

class EditorServiceClass {
  private doc: EditorDocument | null = null
  private undoStack: string[] = []
  private redoStack: string[] = []
  private listeners: Listener[] = []
  private autosaveKey = 'editor:session'

  constructor() {
    this.loadFromStorage()
  }

  private notify() {
    if (!this.doc) return
    this.listeners.forEach((l) => l(this.doc!))
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn)
    if (this.doc) fn(this.doc)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn)
    }
  }

  createNew(id = String(Date.now()), title = 'Untitled') {
    const doc: EditorDocument = {
      id,
      title,
      content: '',
      modifiedAt: Date.now(),
    }
    this.doc = doc
    this.undoStack = []
    this.redoStack = []
    this.saveToStorage()
    this.notify()
    return doc
  }

  open(doc: EditorDocument) {
    this.doc = { ...doc }
    this.undoStack = []
    this.redoStack = []
    this.saveToStorage()
    this.notify()
  }

  get() {
    return this.doc
  }

  updateContent(next: string) {
    if (!this.doc) return
    this.undoStack.push(this.doc.content)
    this.doc.content = next
    this.doc.modifiedAt = Date.now()
    this.redoStack = []
    this.saveToStorage()
    this.notify()
  }

  setTitle(title: string) {
    if (!this.doc) return
    this.doc.title = title
    this.doc.modifiedAt = Date.now()
    this.saveToStorage()
    this.notify()
  }

  canUndo() {
    return this.undoStack.length > 0
  }

  canRedo() {
    return this.redoStack.length > 0
  }

  undo() {
    if (!this.doc || !this.canUndo()) return
    const prev = this.undoStack.pop()!
    this.redoStack.push(this.doc.content)
    this.doc.content = prev
    this.doc.modifiedAt = Date.now()
    this.saveToStorage()
    this.notify()
  }

  redo() {
    if (!this.doc || !this.canRedo()) return
    const next = this.redoStack.pop()!
    this.undoStack.push(this.doc.content)
    this.doc.content = next
    this.doc.modifiedAt = Date.now()
    this.saveToStorage()
    this.notify()
  }

  private saveToStorage() {
    if (!this.doc) return;
    try {
      localStorage.setItem(this.autosaveKey, JSON.stringify(this.doc));
    } catch (error) {
      console.error('[EditorService.saveToStorage]', error);
    }
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.autosaveKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as EditorDocument;
      this.doc = parsed;
    } catch (error) {
      console.error('[EditorService.loadFromStorage]', error);
    }
  }

  clearStorage() {
    try {
      localStorage.removeItem(this.autosaveKey);
    } catch (error) {
      console.error('[EditorService.clearStorage]', error);
    }
  }
}

export const editorService = new EditorServiceClass()

export type { EditorDocument }
