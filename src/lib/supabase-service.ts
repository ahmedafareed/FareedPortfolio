// --- Site Stats CRUD ---
export type SiteStat = {
  id: string;
  site: string;
  label: string;
  value: number;
  sort_order?: number;
};

export const getSiteStats = async (site: string): Promise<SiteStat[]> => {
  const { data, error } = await supabase
    .from('site_stats')
    .select('*')
    .eq('site', site)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching site stats:', error);
    return [];
  }
  return data || [];
};

export const addSiteStat = async (site: string, label: string, value: number, sort_order?: number): Promise<SiteStat | null> => {
  const { data, error } = await supabase
    .from('site_stats')
    .insert([{ site, label, value, sort_order }])
    .select()
    .single();
  if (error) {
    console.error('Error adding site stat:', error);
    return null;
  }
  return data || null;
};

export const updateSiteStat = async (id: string, label: string, value: number, sort_order?: number): Promise<boolean> => {
  const { error } = await supabase
    .from('site_stats')
    .update({ label, value, sort_order })
    .eq('id', id);
  if (error) {
    console.error('Error updating site stat:', error);
    return false;
  }
  return true;
};

export const deleteSiteStat = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('site_stats')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error deleting site stat:', error);
    return false;
  }
  return true;
};
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

export interface Exhibition {
  id: string;
  title: string;
  venue: string;
  location: string | null;
  year: number;
  month: string | null;
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

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error('[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables. Data fetching will fail.');
}

export const supabase = createClient(supabaseUrl || 'http://missing-url', supabaseAnonKey || 'missing-key');

// Helper to resolve table names based on site key (multi-tenant via table duplication)
// travel site uses original tables; commercial site uses "commercial_" prefixed duplicates.
function table(site: string | undefined, base: string): string {
  if (site === 'commercial') return `commercial_${base}`;
  return base; // default travel
}

// Retrieve site key from environment (server side) or window (client header fallback not accessible here directly)
// We'll allow callers to pass site explicitly; if omitted we default to 'travel'.
function normalizeSite(site?: string | null): string {
  if (site === 'commercial') return 'commercial';
  return 'travel';
}

// Service functions with basic error handling; now site-aware
export class PortfolioService {
  // Optionally accept site key; callers can supply from request headers in server components or context.
  static withSite(site?: string) {
    const resolved = normalizeSite(site);
    return {
      getCategories: () => this.getCategories(resolved),
      getImages: (categoryId?: string) => this.getImages(categoryId, resolved),
      getHeroImage: () => this.getHeroImage(resolved),
      getFeaturedImages: () => this.getFeaturedImages(resolved),
      getAwards: () => this.getAwards(resolved),
      getExhibitions: () => this.getExhibitions(resolved),
      getSetting: (key: string) => this.getSetting(key, resolved),
      getSettings: () => this.getSettings(resolved),
    };
  }
  // Categories
  static async getCategories(site?: string): Promise<PortfolioCategory[]> {
    try {
      const t = table(site, 'portfolio_categories');
      const { data, error } = await supabase
        .from(t)
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  static async createCategory(category: Partial<PortfolioCategory>, site?: string): Promise<PortfolioCategory | null> {
    try {
      const t = table(site, 'portfolio_categories');
      const { data, error } = await supabase
        .from(t)
        .insert(category as any)
        .select()
        .single();
      if (error) {
        // Print error details for debugging
        console.error('Error creating category:', error, JSON.stringify(error));
        throw error;
      }
      return data;
    } catch (error) {
      // Print error object and stringified version
      console.error('Error creating category:', error, JSON.stringify(error));
      return null;
    }
  }

  static async updateCategory(id: string, updates: Partial<PortfolioCategory>, site?: string): Promise<PortfolioCategory | null> {
    try {
      const t = table(site, 'portfolio_categories');
      const { data, error } = await supabase
        .from(t)
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

  static async deleteCategory(id: string, site?: string): Promise<boolean> {
    try {
      const t = table(site, 'portfolio_categories');
      const { error } = await supabase
        .from(t)
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
  static async getImages(categoryId?: string, site?: string): Promise<PortfolioImageWithCategory[]> {
    try {
      const t = table(site, 'portfolio_images');
      const catTable = table(site, 'portfolio_categories');
      let query = supabase
        .from(t)
        .select(`
          *,
          category:${catTable}(*)
        `)
        .order('title', { ascending: false }); // Sort by last modified in descending order

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return (data as unknown as PortfolioImageWithCategory[]) || [];
    } catch (error) {
      console.error('Error fetching images:', error, JSON.stringify(error));
      return [];
    }
  }

  static async getHeroImage(site?: string): Promise<PortfolioImageWithCategory | null> {
    try {
      const t = table(site, 'portfolio_images');
      const catTable = table(site, 'portfolio_categories');
      const { data, error } = await supabase
        .from(t)
        .select(`
          *,
          category:${catTable}(*)
        `)
        .eq('is_hero', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
  return (data as unknown as PortfolioImageWithCategory) || null;
    } catch (error) {
      console.error('Error fetching hero image:', error);
      return null;
    }
  }

  static async getFeaturedImages(site?: string): Promise<PortfolioImageWithCategory[]> {
    try {
      const t = table(site, 'portfolio_images');
      const catTable = table(site, 'portfolio_categories');
      const { data, error } = await supabase
        .from(t)
        .select(`
          *,
          category:${catTable}(*)
        `)
        .eq('is_featured', true)
        .order('sort_order');
      
      if (error) throw error;
  return (data as unknown as PortfolioImageWithCategory[]) || [];
    } catch (error) {
      console.error('Error fetching featured images:', error);
      return [];
    }
  }

  static async createImage(image: Partial<PortfolioImage>, site?: string): Promise<PortfolioImage | null> {
    try {
      const t = table(site, 'portfolio_images');
      const { data, error } = await supabase
        .from(t)
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

  static async updateImage(id: string, updates: Partial<PortfolioImage>, site?: string): Promise<PortfolioImage | null> {
    try {
      const t = table(site, 'portfolio_images');
      const { data, error } = await supabase
        .from(t)
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

  static async deleteImage(id: string, site?: string): Promise<boolean> {
    try {
      const t = table(site, 'portfolio_images');
      const { error } = await supabase
        .from(t)
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
  static async getAwards(site?: string): Promise<Award[]> {
    try {
      const resolved = normalizeSite(site);
      const t = table(resolved, 'awards');
      // eslint-disable-next-line no-console
      console.log(`[Supabase:getAwards] Query table=${t}`);
      const { data, error } = await supabase
        .from(t)
        .select('*')
        .order('year', { ascending: false });
      if (error) throw error;
      // eslint-disable-next-line no-console
      console.log(`[Supabase:getAwards] rows=${data?.length || 0}`);
      return data || [];
    } catch (error) {
      console.error('Error fetching awards:', error);
      return [];
    }
  }

  static async createAward(award: Partial<Award>, site?: string): Promise<Award | null> {
    try {
      const t = table(site, 'awards');
      const { data, error } = await supabase
        .from(t)
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

  static async updateAward(id: string, updates: Partial<Award>, site?: string): Promise<Award | null> {
    try {
      const t = table(site, 'awards');
      const { data, error } = await supabase
        .from(t)
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

  static async deleteAward(id: string, site?: string): Promise<boolean> {
    try {
      const t = table(site, 'awards');
      const { error } = await supabase
        .from(t)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting award:', error);
      return false;
    }
  }

  // Exhibitions
  static async getExhibitions(site?: string): Promise<Exhibition[]> {
    try {
      const resolved = normalizeSite(site);
      const t = table(resolved, 'exhibitions');
      // eslint-disable-next-line no-console
      console.log(`[Supabase:getExhibitions] Query table=${t}`);
      const { data, error } = await supabase
        .from(t)
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      console.log(`[Supabase:getExhibitions] rows=${data?.length || 0}`);
      return data || [];
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
      return [];
    }
  }

  static async createExhibition(exhibition: Omit<Exhibition, 'id' | 'created_at' | 'updated_at'>, site?: string): Promise<Exhibition | null> {
    try {
      const t = table(site, 'exhibitions');
      const { data, error } = await supabase
        .from(t)
        .insert(exhibition as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating exhibition:', error);
      return null;
    }
  }

  static async updateExhibition(id: string, updates: Partial<Exhibition>, site?: string): Promise<Exhibition | null> {
    try {
      const t = table(site, 'exhibitions');
      const { data, error } = await supabase
        .from(t)
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating exhibition:', error);
      return null;
    }
  }

  static async deleteExhibition(id: string, site?: string): Promise<boolean> {
    try {
      const t = table(site, 'exhibitions');
      const { error } = await supabase
        .from(t)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting exhibition:', error);
      return false;
    }
  }

  // Site Settings
  static async getSetting(key: string, site?: string): Promise<SiteSetting | null> {
    try {
      const t = table(site, 'site_settings');
      const { data, error } = await supabase
        .from(t)
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

  static async getSettings(site?: string): Promise<SiteSetting[]> {
    try {
      const t = table(site, 'site_settings');
      const { data, error } = await supabase
        .from(t)
        .select('*')
        .order('key');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching settings:', error);
      return [];
    }
  }

  static async setSetting(key: string, value: string, description?: string, type: string = 'text', site?: string): Promise<SiteSetting | null> {
    try {
      if (!key || typeof key !== 'string' || key.trim() === '') {
        throw new Error('Setting key must be a non-empty string');
      }
      if (typeof value !== 'string') {
        throw new Error('Setting value must be a string');
      }
      if (type && typeof type !== 'string') {
        throw new Error('Setting type must be a string');
      }
      const upsertPayload = {
        key,
        value,
        description,
        type: type || 'text'
      };
      const t = table(site, 'site_settings');
      const { data, error } = await supabase
        .from(t)
        .upsert(upsertPayload as any, { onConflict: 'key' })
        .select()
        .single();

      if (error) {
        let userMessage = 'Unknown error saving setting.';
        if (error.code === '42501' || (error.details && error.details.includes('permission denied'))) {
          userMessage = 'Permission denied: Supabase Row Level Security (RLS) or API key does not allow upsert.';
        } else if (error.code === '23505' || (error.details && error.details.includes('duplicate key'))) {
          userMessage = 'Duplicate key error: This setting key already exists.';
        } else if (error.code === '23514' || (error.details && error.details.includes('violates check constraint'))) {
          userMessage = 'Constraint violation: One or more fields do not meet table requirements.';
        } else if (error.details) {
          userMessage = error.details;
        }
        console.error('Supabase upsert error:', JSON.stringify(error, null, 2));
        console.error('Upsert payload:', JSON.stringify(upsertPayload, null, 2));
        if (error.details) {
          console.error('Supabase error details:', error.details);
        }
        if (error.hint) {
          console.error('Supabase error hint:', error.hint);
        }
        throw new Error(userMessage);
      }
      if (!data) {
        console.error('Supabase upsert returned no data:', upsertPayload);
      }
      return data;
    } catch (error) {
      console.error('Error setting value:', error);
      return null;
    }
  }

  static async deleteSetting(key: string, site?: string): Promise<boolean> {
    try {
      const t = table(site, 'site_settings');
      const { error } = await supabase
        .from(t)
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