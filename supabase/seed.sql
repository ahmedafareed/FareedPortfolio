-- Seed data for Ahmed Fareed Photography Portfolio
-- This file contains initial data to populate the database

-- Insert default portfolio categories
INSERT INTO portfolio_categories (name, display_name, description, sort_order) VALUES
('weddings', 'Weddings', 'Wedding photography capturing love and celebration', 1),
('portraits', 'Portraits', 'Professional portrait photography', 2),
('landscapes', 'Landscapes', 'Nature and landscape photography', 3)
ON CONFLICT (name) DO NOTHING;

-- Insert site settings
INSERT INTO site_settings (key, value, description, type) VALUES
('hero_image_id', '', 'ID of the image to use as the homepage hero', 'text'),
('site_tagline', 'Capturing Moments, Creating Memories', 'Main tagline for the website', 'text'),
('contact_email', 'hello@ahmedfareed.com', 'Contact email address', 'text'),
('about_description', 'My creative philosophy is simple: to capture authentic moments in the most beautiful way possible. I believe that the best photographs are not staged, but are born from genuine emotion and connection. My goal is to create images that are both timeless and deeply personal.', 'About page description', 'text')
ON CONFLICT (key) DO NOTHING;