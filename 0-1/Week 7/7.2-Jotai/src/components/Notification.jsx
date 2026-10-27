import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { notificationAtom, fetchNotificationAtom2 } from "../store/atoms/notification";

//async read atom demo
export function Noti() {
    const noti = useAtomValue(notificationAtom);
    return <h2>{noti.notifications}</h2>;
}

//async write atom demo
export function Noti2() {
    const [noti, fetchNoti] = useAtom(fetchNotificationAtom2);
    return (
        <div>
            <button onClick={() => fetchNoti()}>Load Notification</button>
            <h2>{noti?.notifications ?? "No notifications loaded yet"}</h2>
        </div>
    );
}
//should be wrapped in suspense in app.jsx to add a fallback untill data is fetched
