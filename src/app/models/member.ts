export type MemberEventStatus = 'invited' | 'accepted' | 'rejected'
export interface Member {
    id?: string;
    name: string;
    status?: MemberEventStatus;
}
