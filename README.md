# Dentafile

A modern dental file management system.

## Development

### Prerequisites
- Node.js 18.18.0 or higher
- npm 9.x or higher

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

### Cloudflare Pages

This project is configured for deployment on Cloudflare Pages.

#### Deployment Settings
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: 18.18.0 or higher

#### Custom Domain Setup
1. Go to Cloudflare Pages dashboard
2. Select the project
3. Go to Custom domains
4. Add your domain: dentafile.com
5. Follow the DNS configuration steps

## Project Structure
- `/src` - Source code
- `/public` - Static assets
- `/dist` - Build output (not committed to repo)

## Technologies
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase

## Environment Variables
Copy `.env.example` to `.env` and fill in the required values:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
