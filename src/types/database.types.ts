export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: 'backlog' | 'todo' | 'upcoming' | 'done'
          priority: 'low' | 'medium' | 'high'
          due_date: string | null
          team_id: string | null
          assigned_to: string | null
          project_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: 'backlog' | 'todo' | 'upcoming' | 'done'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          team_id?: string | null
          assigned_to?: string | null
          project_id?: string | null
          created_at?: string
          updated_at?: string
          
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: 'backlog' | 'todo' | 'upcoming' | 'done'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          team_id?: string | null
          assigned_to?: string | null
          project_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row:{
          id: string
          name:string
          description: string | null
          created_at:string
          updated_at: string
          owner_id:string
          invite_code:string
        }
        Insert:{
           id?: string
          name:string
          description?: string | null
          created_at?:string
          updated_at?:string
          owner_id:string
          invite_code:string
        }
        Update:{
           id?: string
          name?:string
          description?: string | null
          created_at?:string
          updated_at?:string
          owner_id?:string
          invite_code?:string
        }
      }
      team_members:{
        Row:{
          id:string
          team_id:string
          user_id:string
          role:'owner' | 'member' | 'admin' | 'guest'
          joined_at:string
        }
        Insert:{
           id?:string
          team_id:string
          user_id:string
          role?:'owner' | 'member' | 'admin' | 'guest'
          joined_at?:string
        }
        Update:{
           id?:string
          team_id?:string
          user_id?:string
          role?:'owner' | 'member' | 'admin' | 'guest'
          joined_at?:string
        }
      }
      task_assignments:{
        Row: {
          id:string
          task_id:string
          user_id:string
          assigned_at:string
          assigned_by:string
        }
        Insert:{
          id?:string
          task_id:string
          user_id:string
          assigned_at?:string
          assigned_by:string
        }
        Update:{
          id?:string
          task_id?:string
          user_id?:string
          assigned_at?:string
          assigned_by?:string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export type TaskStatus = 'backlog' | 'todo' | 'upcoming' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export type Team = Database['public']['Tables']['teams']['Row']
export type TeamInsert = Database['public']['Tables']['teams']['Insert']
export type TeamUpdate = Database['public']['Tables']['teams']['Update']

export type TeamMember = Database['public']['Tables']['team_members']['Row']
export type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert']
export type TeamMemberUpdate = Database['public']['Tables']['team_members']['Update']

export type TaskAssignment = Database['public']['Tables']['task_assignments']['Row']

export type TeamRole = Database['public']['Tables']['team_members']['Row']['role']