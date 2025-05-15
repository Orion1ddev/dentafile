# Deployment Guide for dentafile.com

## Pre-deployment Checklist

1. Ensure all files are committed to GitHub
2. Check that the following files exist and are properly configured:
   - [x] wrangler.toml
   - [x] .npmrc
   - [x] public/_headers
   - [x] public/_routes.json
   - [x] .cloudflare/pages.json

## Cloudflare Pages Settings

### Build Configuration
```
Framework preset: None
Build command: npm run build
Build output directory: dist
Root directory: /
```

### Environment Variables
```
NODE_VERSION: 18.17.1
NPM_VERSION: 9.6.7
NODE_ENV: production
```

### Branch Deployments
- Production branch: main
- Preview branches: *

## Domain Settings

1. Go to Cloudflare Pages dashboard
2. Select your project (dentafile)
3. Click on "Custom domains"
4. Add custom domain:
   - Domain: dentafile.com
   - DNS record: CNAME
   - SSL/TLS: Full

## Post-deployment Verification

1. Check the following URLs:
   - [ ] https://dentafile.com
   - [ ] https://dentafile.com/assets/* (static assets)
   - [ ] https://dentafile.com/* (SPA routes)

2. Verify functionality:
   - [ ] Static assets loading
   - [ ] SPA routing working
   - [ ] API connections (Supabase)
   - [ ] Authentication flows

## Troubleshooting

If build fails:
1. Check build logs for errors
2. Verify Node.js and NPM versions
3. Clear cache and trigger new build
4. Check package.json for correct build script

If routing issues:
1. Verify _routes.json configuration
2. Check wrangler.toml settings
3. Clear browser cache
4. Check Cloudflare's DNS settings

## Maintenance

Regular checks:
1. Monitor error rates in Cloudflare dashboard
2. Check performance metrics
3. Update dependencies when needed
4. Review security headers in _headers file 