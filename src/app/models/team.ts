import { Member } from "./member";
import { TeamEvent } from "./team-event";

export interface Team {
    id?: string;
    events: TeamEvent[];
    members: Member[];
    name: string;
    description: string;
    adminIds: string[];
}
