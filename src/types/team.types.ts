import {Team, TeamMember, TeamRole} from './database.types'



export interface TeamWithMembers extends Team {
    team_members: TeamMember[];
    member_count?: number;
}

export interface TeamWithMemberDetails extends Team{
    team_members: (TeamMember & {
        profiles?:{
            full_name: string | null;
            avatar_url:string | null;
        }
    })[]
}

export interface CreateTeamData{
    name: string;
    description?: string;
}

export interface UpdateTeamData {
    name?: string;
    description?: string;
}

export interface InviteMemberData{
    email: string;
    role?: TeamRole;
}

export type {Team, TeamMember, TeamRole}