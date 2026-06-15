# Vision Board - Environment Setup

## Required Environment Variables

To use authentication and cloud storage features, you need to set up the following environment variables:

### Frontend (.env file in root directory)

Create a `.env` file in the root directory with:

```
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Where to find these values:

1. Go to your Supabase project dashboard
2. Click on "Project Settings" (gear icon)
3. Navigate to "API" section
4. Copy:
   - **Project ID**: Found in the URL or Reference ID
   - **Anon/Public Key**: The `anon` `public` key

### Example:

```
VITE_SUPABASE_PROJECT_ID=abcdefghijklmnop
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Features

- **Without Login**: Data saved to browser localStorage (device-specific)
- **With Login**: Data saved to cloud (syncs across devices)

## Notes

- The email confirmation is automatically handled (no email server needed)
- All passwords must be at least 6 characters
- Theme customizations are saved per user when logged in
