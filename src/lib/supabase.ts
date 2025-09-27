// Re-export the enhanced Supabase service
export { supabase, PortfolioService } from './supabase-service';
export type { 
  PortfolioCategory, 
  PortfolioImage, 
  Award, 
  Exhibition,
  SiteSetting, 
  PortfolioImageWithCategory
} from './supabase-service';
