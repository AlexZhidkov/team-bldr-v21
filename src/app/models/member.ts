export interface Member {
    id?: string;
    name: string;
    status?: 'invited' | 'accepted' | 'rejected'
}
