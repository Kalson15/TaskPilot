import { supabase } from "../supabase";
import type { CreateTeamData, UpdateTeamData } from "@/types/team.types";



//Create new team
export async function createTeam(data: CreateTeamData, userId: string){
   

    const {data: team, error: teamError} = await supabase
    .from('teams')
    .insert({
        name: data.name,
        description: data.description || null,
        
        owner_id: userId,
    })
    .select()
    .single()

    if(teamError) throw teamError;

    //Add createor as owner
    const {error: memberError} = await supabase
    .from('team_members')
    .insert({
        team_id: team.id,
        user_id: userId,
        role: 'owner',
    }  )
    if(memberError) throw memberError

    return team;
}

//Get all teams for a user
export async function getUserTeams(userId:string){
    const {data, error} = await supabase
    .from('team_members')
    .select(`
        team_id,
        role,
        joined_at,
        teams (
        id,
        name,
        description,
        created_at,
        updated_at,
        owner_id
        )
        `)
        .eq('user_id',userId)
        .order('joined_at',{ascending: false});

        if(error) throw error;
        
       //transform the data to flatten the structure
       return (data || []).map((item: any) => {
        const team = Array.isArray(item.teams) ? item.teams[0] : item.teams;
         return {
            ...team,
            role: item.role,
            joined_at: item.joined_at,
        }
       })
       
}

//get team by ID with members
export async function getTeamById(teamId: string){
    const{data, error} = await supabase
    .from('teams')
    .select('* , team_members ( id, user_id, role, joined_at, profiles(full_name, avatar_url) )')
        .eq('id',teamId)
        .single();

        if(error) throw error
        return data;
}

//update team
export async function updateTeam(teamId:string, data: UpdateTeamData){
    const {data: team, error} = await supabase
    .from('teams')
    .update(data)
    .eq('id', teamId)
    .select()
    .single()

    if(error) throw error
    return team;
}

//delete team
export async function deleteTeam(teamId: string){
    const{error} = await supabase
    .from('teams')
    .delete()
    .eq('id', teamId)

    if(error) throw error
}



//leave team
export async function leaveTeam(teamId: string, userId: string){
    const{error} = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', userId)

    if(error) throw error
}

//get team members 
export async function getTeamMembers(teamId: string){
    const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select('id,user_id,role,joined_at')
        .eq('team_id', teamId)
        .order('joined_at', { ascending: true });

    if (membersError) throw membersError;
    if (!members || members.length === 0) return [];

    const userIds = members.map((m: any) => m.user_id);
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id,full_name,avatar_url')
        .in('id', userIds);

    if (profilesError) throw profilesError;

    const profileMap = (profiles || []).reduce((acc: any, p: any) => {
        acc[p.id] = p;
        return acc;
    }, {} as Record<string, any>);

    return members.map((m: any) => ({
        ...m,
        profiles: profileMap[m.user_id]
            ? {
                  full_name: profileMap[m.user_id].full_name,
                  avatar_url: profileMap[m.user_id].avatar_url,
              }
            : undefined,
    }));
}

//remove team members- ownwer only/admin
export async function removeTeamMember(teamId:string, userId:string){
    const{error} = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', userId)

    if(error) throw error
    
}

//update member role(owner only)
export async function updateMemberRole(
    teamId: string,
    userId:string,
    role: 'owner' | 'member' |'admin'|'guest'
){
    const{error} = await supabase
    .from('team_members')
    .update({role})
    .eq('team_id', teamId)
    .eq('user_id',userId)

    if(error) throw error
}

//generate new invite code for team
export async function regenerateInviteCode(teamId:string){
    const newCode = Math.random().toString(36).substring(2, 12).toUpperCase()

    const {data, error} = await supabase
     .from('teams')
     .update({invite_code: newCode})
     .eq('id', teamId)
     .select('invite_code')
     .single()

     if(error) throw error
     return data.invite_code;
}

//join team by invite code
export async function joinTeamByInviteCode(inviteCode: string, userId: string){
    //find team by invite code
    const {data: team, error:teamError} = await supabase
    .from('teams')
    .select('id, name')
    .eq('invite_code', inviteCode)
    .single()

    if(teamError){
        if(teamError.code == 'PGRST116'){
            throw new Error('Invalid invite code')
        }
        throw teamError
    }

    //check if already a member
    const {data: existing} = await supabase
    .from('team_members')
    .select('id')
    .eq('team_id', team.id)
    .eq('user_id', userId)
    .single()

    if(existing){
        throw new Error('You are already a member of this team')
    }

    //Add as member
    const {error: memberError} = await supabase
    .from('team_members')
    .insert({
        team_id: team.id,
        user_id: userId,
        role: 'member',
    })

    if(memberError) throw memberError

    return team
}

//send email invitation(placeholder -would integrate with email service)
export async function inviteMemberByEmail(teamId: string, email:string){
    //get team details
    const{data:team, error:teamError} = await supabase
    .from('teams')
    .select('name, invite_code')
    .eq('id', teamId)
    .single()

    if(teamError) throw teamError;

    //for now we'll just return the invite link
    const inviteLink = `${window.location.origin}/teams/join/${team.invite_code}`;

    return{
        inviteLink,
        email,
        teamName: team.name,
    }


}
export async function getTeamByInviteCode(inviteCode: string){
    const{data, error} = await supabase
    .from('teams')
    .select('id, name, description, created_at')
    .eq('invite_code', inviteCode)
    .maybeSingle();

    if(error){
        console.error('Error fetching team preview:' , error)
        throw new Error('Invalid or expired invite link')
    }

    return data
}