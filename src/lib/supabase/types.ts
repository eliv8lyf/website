export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          organisation: string | null
          country: string | null
          service: string | null
          message: string | null
          referral_source: string | null
          ip_address: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          organisation?: string | null
          country?: string | null
          service?: string | null
          message?: string | null
          referral_source?: string | null
          ip_address?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          organisation?: string | null
          country?: string | null
          service?: string | null
          message?: string | null
          referral_source?: string | null
          ip_address?: string | null
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
      showcases: {
        Row: {
          id: string
          title: string
          description: string
          category: 'app' | 'generative_media' | 'agent'
          url: string | null
          media_url: string | null
          media_type: 'image' | 'video'
          tags: string[] | null
          published: boolean
          sort_order: number
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: 'app' | 'generative_media' | 'agent'
          url?: string | null
          media_url?: string | null
          media_type?: 'image' | 'video'
          tags?: string[] | null
          published?: boolean
          sort_order?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: 'app' | 'generative_media' | 'agent'
          url?: string | null
          media_url?: string | null
          media_type?: 'image' | 'video'
          tags?: string[] | null
          published?: boolean
          sort_order?: number
          created_at?: string | null
        }
        Relationships: []
      }
      nav_items: {
        Row: { id: string; label: string; url: string; sort_order: number; is_cta: boolean; published: boolean; created_at: string | null }
        Insert: { id?: string; label: string; url: string; sort_order?: number; is_cta?: boolean; published?: boolean; created_at?: string | null }
        Update: { id?: string; label?: string; url?: string; sort_order?: number; is_cta?: boolean; published?: boolean; created_at?: string | null }
        Relationships: []
      }
      services: {
        Row: { id: string; num: string; icon: string; title: string; description: string; tags: string[] | null; deliverables: string[] | null; sort_order: number; published: boolean; created_at: string | null }
        Insert: { id?: string; num: string; icon: string; title: string; description: string; tags?: string[] | null; deliverables?: string[] | null; sort_order?: number; published?: boolean; created_at?: string | null }
        Update: { id?: string; num?: string; icon?: string; title?: string; description?: string; tags?: string[] | null; deliverables?: string[] | null; sort_order?: number; published?: boolean; created_at?: string | null }
        Relationships: []
      }
      stats: {
        Row: { id: string; value_text: string; label: string; sort_order: number; created_at: string | null }
        Insert: { id?: string; value_text: string; label: string; sort_order?: number; created_at?: string | null }
        Update: { id?: string; value_text?: string; label?: string; sort_order?: number; created_at?: string | null }
        Relationships: []
      }
      process_steps: {
        Row: { id: string; step_num: string; title: string; timeframe: string; description: string; sort_order: number; created_at: string | null }
        Insert: { id?: string; step_num: string; title: string; timeframe: string; description: string; sort_order?: number; created_at?: string | null }
        Update: { id?: string; step_num?: string; title?: string; timeframe?: string; description?: string; sort_order?: number; created_at?: string | null }
        Relationships: []
      }
      why_cards: {
        Row: { id: string; icon: string; title: string; description: string; sort_order: number; created_at: string | null }
        Insert: { id?: string; icon: string; title: string; description: string; sort_order?: number; created_at?: string | null }
        Update: { id?: string; icon?: string; title?: string; description?: string; sort_order?: number; created_at?: string | null }
        Relationships: []
      }
      sectors: {
        Row: { id: string; icon: string; name: string; description: string; sort_order: number; created_at: string | null }
        Insert: { id?: string; icon: string; name: string; description: string; sort_order?: number; created_at?: string | null }
        Update: { id?: string; icon?: string; name?: string; description?: string; sort_order?: number; created_at?: string | null }
        Relationships: []
      }
      site_text: {
        Row: { id: string; key: string; value: string; section: string; label: string; created_at: string | null }
        Insert: { id?: string; key: string; value: string; section?: string; label?: string; created_at?: string | null }
        Update: { id?: string; key?: string; value?: string; section?: string; label?: string; created_at?: string | null }
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
export type Showcase = Database['public']['Tables']['showcases']['Row']
export type NavItem = Database['public']['Tables']['nav_items']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type Stat = Database['public']['Tables']['stats']['Row']
export type ProcessStep = Database['public']['Tables']['process_steps']['Row']
export type WhyCard = Database['public']['Tables']['why_cards']['Row']
export type Sector = Database['public']['Tables']['sectors']['Row']
export type SiteText = Database['public']['Tables']['site_text']['Row']
