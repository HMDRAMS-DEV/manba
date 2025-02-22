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
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          funding_goal: number
          current_amount: number
          status: 'draft' | 'active' | 'completed' | 'delisted'
          images: string[]
          user_id: string
          video_url?: string | null
          location: string
          category: string
          short_description: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          funding_goal: number
          current_amount?: number
          status?: 'draft' | 'active' | 'completed' | 'delisted'
          images: string[]
          user_id: string
          video_url?: string | null
          location: string
          category: string
          short_description: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          funding_goal?: number
          current_amount?: number
          status?: 'draft' | 'active' | 'completed' | 'delisted'
          images?: string[]
          user_id?: string
          video_url?: string | null
          location?: string
          category?: string
          short_description?: string
        }
      }
      pledges: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          amount: number
          project_id: string
          user_id: string
          status: 'pending' | 'completed' | 'failed'
          message?: string | null
          anonymous: boolean
          email: string
          name: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          amount: number
          project_id: string
          user_id?: string
          status?: 'pending' | 'completed' | 'failed'
          message?: string | null
          anonymous?: boolean
          email: string
          name: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          amount?: number
          project_id?: string
          user_id?: string
          status?: 'pending' | 'completed' | 'failed'
          message?: string | null
          anonymous?: boolean
          email?: string
          name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
