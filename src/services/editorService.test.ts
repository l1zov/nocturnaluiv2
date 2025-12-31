import { beforeEach, describe, expect, it } from 'vitest'
import { editorService } from './editorService'

beforeEach(() => {
  editorService.clearStorage()
})

describe('editorService', () => {
  it('creates new document and retrieves it', () => {
    const doc = editorService.createNew('test-id', 'Test')
    expect(doc.id).toBe('test-id')
    const got = editorService.get()
    expect(got).not.toBeNull()
    expect(got!.id).toBe('test-id')
  })

  it('updates content and supports undo/redo', () => {
    editorService.createNew('u1', 'U')
    editorService.updateContent('first')
    editorService.updateContent('second')

    expect(editorService.get()!.content).toBe('second')
    expect(editorService.canUndo()).toBe(true)
    editorService.undo()
    expect(editorService.get()!.content).toBe('first')
    expect(editorService.canRedo()).toBe(true)
    editorService.redo()
    expect(editorService.get()!.content).toBe('second')
  })

  it('persists to localStorage', () => {
    editorService.createNew('p1', 'P')
    editorService.updateContent('persist me')
    const raw = localStorage.getItem('editor:session')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw as string)
    expect(parsed.content).toBe('persist me')
  })
})
