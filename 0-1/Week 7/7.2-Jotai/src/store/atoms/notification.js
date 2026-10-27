import { atom } from 'jotai'

/* ----------------------------- Async read Atom ---------------------------- */
export const notificationAtom = atom(async () => {
    // await new Promise((r) => setTimeout(r, 5000));
    const response = await fetch('http://localhost:3000/notifications');
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    return response.json();
});

/* ---------------------------- Async read/write atom ---------------------------- */
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
