import { Member } from "./member";
import { TeamEvent } from "./team-event";

export interface Tribe {
    id?: string;
    events: TeamEvent[];
    members: Member[];
    name: string;
    description: string;
}
