import { createClient } from '@supabase/supabase-js';

// Database types (simplified for now)
export interface PortfolioCategory {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioImage {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  aspect_ratio: 'portrait' | 'landscape' | 'square';
  image_url: string;
  storage_path: string | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  is_featured: boolean;
  is_hero: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Award {
  id: string;
  title: string;
  event: string;
  year: number;
  description: string | null;
  image_url: string | null;
  storage_path: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
  type: string;
  created_at: string;
  updated_at: string;
}

// Extended types with joins
export type PortfolioImageWithCategory = PortfolioImage & {
  category: PortfolioCategory | null;
};

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service functions with basic error handling
export class PortfolioService {
  // Categories
  static async getCategories(): Promise<PortfolioCategory[]> {
    try {
      const { data, error } = await supabase
        .from('portfolio_categories')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  static async createCategory(category: Partial<PortfolioCategory>): Promise<PortfolioCategory | null> {
    try {
      const { data, error } = await supabase
        .from('portfolio_categories')
        .insert(category as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  }

  static async updateCategory(id: string, updates: Partial<PortfolioCategory>): Promise<PortfolioCategory | null> {
    try {
      const { data, error } = await supabase
        .from('portfolio_categories')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  }

  static async deleteCategory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('portfolio_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  // Portfolio Images
  static async getImages(categoryId?: string): Promise<PortfolioImageWithCategory[]> {
    try {
      let query = supabase
        .from('portfolio_images')
        .select(`
          *,
          category:portfolio_categories(*)
        `)
        .order('sort_order');

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return (data || []) as PortfolioImageWithCategory[];
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  }

  static async getHeroImage(): Promise<PortfolioImageWithCategory | null> {
    try {
      const { data, error } = await supabase
        .from('portfolio_images')
        .select(`
          *,
          category:portfolio_categories(*)
        `)
        .eq('is_hero', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return (data as PortfolioImageWithCategory) || null;
    } catch (error) {
      console.error('Error fetching hero image:', error);
      return null;
    }
  }

  static async getFeaturedImages(): Promise<PortfolioImageWithCategory[]> {
    try {
      const { data, error } = await supabase
        .from('portfolio_images')
        .select(`
          *,
          category:portfolio_categories(*)
        `)
        .eq('is_featured', true)
        .order('sort_order');
      
      if (error) throw error;
      return (data || []) as PortfolioImageWithCategory[];
    } catch (error) {
      console.error('Error fetching featured images:', error);
      return [];
    }
  }

  static async createImage(image: Partial<PortfolioImage>): Promise<PortfolioImage | null> {
    try {
      const { data, error } = await supabase
        .from('portfolio_images')
        .insert(image as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating image:', error);
      return null;
    }
  }

  static async updateImage(id: string, updates: Partial<PortfolioImage>): Promise<PortfolioImage | null> {
    try {
      const { data, error } = await supabase
        .from('portfolio_images')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating image:', error);
      return null;
    }
  }

  static async deleteImage(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('portfolio_images')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Awards
  static async getAwards(): Promise<Award[]> {
    try {
      const { data, error } = await supabase
        .from('awards')
        .select('*')
        .order('year', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching awards:', error);
      return [];
    }
  }

  static async createAward(award: Partial<Award>): Promise<Award | null> {
    try {
      const { data, error } = await supabase
        .from('awards')
        .insert(award as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating award:', error);
      return null;
    }
  }

  static async updateAward(id: string, updates: Partial<Award>): Promise<Award | null> {
    try {
      const { data, error } = await supabase
        .from('awards')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating award:', error);
      return null;
    }
  }

  static async deleteAward(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('awards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting award:', error);
      return false;
    }
  }

  // Site Settings
  static async getSetting(key: string): Promise<SiteSetting | null> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching setting:', error);
      return null;
    }
  }

  static async getSettings(): Promise<SiteSetting[]> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching settings:', error);
      return [];
    }
  }

  static async setSetting(key: string, value: string, description?: string, type: string = 'text'): Promise<SiteSetting | null> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({
          key,
          value,
          description,
          type
        } as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error setting value:', error);
      return null;
    }
  }

  static async deleteSetting(key: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('site_settings')
        .delete()
        .eq('key', key);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting setting:', error);
      return false;
    }
  }
}