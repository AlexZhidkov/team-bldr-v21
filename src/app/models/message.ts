export interface Message {
    id?: string;
    userId: string;
    img: string | null;
    name: string | null;
    text: string;
    ts: firebase.default.firestore.Timestamp | Date;
}
