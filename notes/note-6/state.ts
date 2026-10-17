/** Shared persistent state. Read with note.read; this declaration does not expose local React drafts. */
/** Persistent presentation preferences; current tracker facts are a query projection. */
export interface NoteState { title?: string; summary?: string; [key: string]: unknown }
