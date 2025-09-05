# Vercel 404 Error Fix Guide

## Changes Made to Fix the 404 Error

### 1. Fixed vercel.json
- Removed the incorrect `outputDirectory: ".next"` setting
- Next.js on Vercel automatically handles the output directory

### 2. Updated Middleware Configuration
- Changed from a catch-all matcher to specific route matchers
- This prevents middleware from interfering with static assets and API routes

### 3. Enhanced next.config.js
- Added `swcMinify: true` for better Vercel compatibility
- Added experimental app directory support
- Added security headers

### 4. Created Test Routes
- Added `/test` page to verify basic routing works
- Existing `/api/health` endpoint to check API functionality

## Steps to Deploy and Verify

### 1. Commit and Push Changes
```bash
git add .
git commit -m "Fix Vercel 404 error - update config and middleware"
git push origin cursor/troubleshoot-persistent-vercel-404-error-8542
```

### 2. Verify in Vercel Dashboard
1. Go to your Vercel project dashboard
2. Check that the deployment completes successfully
3. Look for any build errors in the logs

### 3. Test the Deployment
Once deployed, test these URLs:
- `https://your-app.vercel.app/` - Homepage
- `https://your-app.vercel.app/test` - Test page (should show if routing works)
- `https://your-app.vercel.app/api/health` - Health check API

### 4. Check Environment Variables
Ensure these are set in Vercel:
- `DATABASE_URL` - Must be the PUBLIC Railway URL (not internal)
- `NEXTAUTH_SECRET` - Your secret key
- `NEXTAUTH_URL` - Your Vercel app URL (no trailing slash)

## Common Issues and Solutions

### Issue 1: Database Connection Fails
If you see database errors in the logs:
1. Go to Railway Dashboard → PostgreSQL → Variables
2. Find the PUBLIC database URL (not the internal one)
3. Update `DATABASE_URL` in Vercel

The public URL should look like:
```
postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
```

NOT like:
```
postgresql://postgres:password@postgres.railway.internal:5432/railway
```

### Issue 2: Prisma Schema Not Found
If you get Prisma-related errors:
1. Ensure `postinstall: "prisma generate"` is in package.json ✓ (already present)
2. The build should automatically run this

### Issue 3: Still Getting 404s
If the test page works but other pages don't:
1. Check Function Logs in Vercel for specific errors
2. The middleware might still be too restrictive
3. There might be issues with data fetching during build

## Next Steps if Still Not Working

1. **Check Function Logs**
   - Vercel Dashboard → Functions → Logs
   - Look for runtime errors

2. **Test Locally with Vercel CLI**
   ```bash
   npm install -g vercel
   vercel dev
   ```

3. **Disable Middleware Temporarily**
   - Rename `src/middleware.ts` to `src/middleware.ts.bak`
   - Push and test if that fixes it

4. **Add Build-Time Logging**
   Update package.json build script:
   ```json
   "build": "SKIP_ENV_VALIDATION=1 next build"
   ```

## Quick Debug Checklist

- [ ] Test page accessible at `/test`
- [ ] Health API returns JSON at `/api/health`
- [ ] Database URL is public (not internal)
- [ ] No TypeScript errors in build logs
- [ ] Environment variables are set in Vercel
- [ ] Build completes successfully

The most common cause is the database URL being internal instead of public!