export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          organisation: string | null
          service: string | null
          message: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          organisation?: string | null
          service?: string | null
          message?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          organisation?: string | null
          service?: string | null
          message?: string | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          title: string | null
          slug: string | null
          excerpt: string | null
          content: string | null
          cover_image: string | null
          category_id: string | null
          published: boolean | null
          published_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title?: string | null
          slug?: string | null
          excerpt?: string | null
          content?: string | null
          cover_image?: string | null
          category_id?: string | null
          published?: boolean | null
          published_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string | null
          slug?: string | null
          excerpt?: string | null
          content?: string | null
          cover_image?: string | null
          category_id?: string | null
          published?: boolean | null
          published_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'posts_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string | null
        }
        Relationships: []
      }
      post_reactions: {
        Row: {
          id: string
          post_slug: string
          emoji: string
          created_at: string | null
        }
        Insert: {
          id?: string
          post_slug: string
          emoji: string
          created_at?: string | null
        }
        Update: {
          id?: string
          post_slug?: string
          emoji?: string
          created_at?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Lead = Database['public']['Tables']['leads']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
