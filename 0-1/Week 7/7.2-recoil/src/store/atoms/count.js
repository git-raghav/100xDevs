import { atom } from 'jotai'
export const countAtom = atom(0);

export const evenDerivedAtom = atom((get) => get(countAtom) % 2 == 0);

//Atoms with Storage
import { atomWithStorage } from "jotai/utils";
const themeAtom = atomWithStorage("theme", "light");


//Derived Atoms
const priceAtom = atom(100);
const quantityAtom = atom(3);
const totalAtom = atom((get) => get(priceAtom) * get(quantityAtom));
