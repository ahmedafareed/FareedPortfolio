# Supabase Backend Setup

This directory contains the database schema and setup files for the Ahmed Fareed Photography Portfolio.

## Setup Instructions

### 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized

### 2. Set Up Environment Variables
Create a `.env.local` file in the root directory with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_password_for_basic_auth
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key # required for uploads
```

### 3. Run Database Schema
1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `schema.sql` 
3. Run the SQL to create all necessary tables, indexes, and policies

### 4. Seed Initial Data
1. Copy and paste the contents of `seed.sql` in the SQL Editor
2. Run the SQL to populate initial categories and settings

### 5. Set Up Storage (Optional)
If you want to use Supabase Storage for image uploads:
1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `portfolio-images`
3. Set the bucket to public if you want images to be publicly accessible
4. The admin upload endpoint stores files at `portfolio-images/<random-name>` and inserts records into `portfolio_images`

## Database Schema Overview

### Tables Created:
- **portfolio_categories**: Photography categories (Weddings, Portraits, Landscapes)
- **portfolio_images**: Individual portfolio images with metadata
- **awards**: Awards and exhibitions information
- **site_settings**: Global site configuration

### Key Features:
- **Row Level Security (RLS)**: Public read access, authenticated write access
- **Triggers**: Automatic `updated_at` timestamp updates
- **Constraints**: Aspect ratio validation, unique constraints
- **Indexes**: Optimized for common queries

### Admin Panel Features:
- **Portfolio Management**: Add, edit, delete images with category assignment
- **Awards Management**: Manage awards and exhibitions
- **Site Settings**: Control hero image and global site configuration
- **Category Management**: Create and manage portfolio categories

## Security Notes

- The current RLS policies allow public read access and authenticated user write access
- In production, you should implement proper admin-only policies
- The middleware uses basic HTTP authentication for admin panel access
- Environment variables should be kept secure and not committed to version control

## Next Steps

1. Set up your Supabase project and environment variables
2. Run the schema and seed SQL files
3. Access the admin panel at `/admin` (requires basic auth)
4. Start adding your portfolio images and content

## Troubleshooting

- **Connection issues**: Verify your environment variables are correct
- **Permission errors**: Check your RLS policies in Supabase
- **Image upload issues**: Ensure your image URLs are accessible and valid
- **Admin access**: Verify your ADMIN_PASSWORD environment variable is set