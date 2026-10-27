import { atom } from 'jotai'
/* ------------------------------- Normal atom ------------------------------ */
export const countAtom = atom(0);

/* -------------------------- Atoms with Storage -------------------------- */
import { atomWithStorage } from "jotai/utils";
const themeAtom = atomWithStorage("theme", "light");

/* ------------------------------ Derived Atoms ----------------------------- */
const priceAtom = atom(100);
const quantityAtom = atom(3);
const totalAtom = atom((get) => get(priceAtom) * get(quantityAtom));
export const evenDerivedAtom = atom((get) => get(countAtom) % 2 == 0);

/* ----------------------------- Async read Atom ---------------------------- */
export const notificationAtom = atom(async () => {
    // await new Promise((r) => setTimeout(r, 5000));
    const response = await fetch('http://localhost:3000/notifications');
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    return response.json();
});

/* ---------------------------- async write atom ---------------------------- */
export const notificationAtom2 = atom(null);

export const fetchNotificationAtom2 = atom(
    (get) => get(notificationAtom2), //custom getter
    async (_get, set, _payload) => { //'_get' warns your code linter not to complain about an unused variable | custom setter
        const response = await fetch("http://localhost:3000/notifications");

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const noti2 = await response.json();

        set(notificationAtom2, noti2);
    }
);
