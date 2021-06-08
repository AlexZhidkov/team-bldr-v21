import { Member } from "./member";
import { Message } from "./message";

export interface TeamEvent {
    id?: string;
    members: Member[];
    messages: Message[];
    name: string;
    dateTime: firebase.default.firestore.Timestamp | Date;
}
