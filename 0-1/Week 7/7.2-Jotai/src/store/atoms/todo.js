import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

/* ------------------------------- atom family ------------------------------ */
export const todoIdsAtom = atom([1, 2]);

export const todoFamily = atomFamily((id) => atom({ id, task: '', completed: false }))
