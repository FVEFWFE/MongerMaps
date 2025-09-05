# How to Find Your Railway Public Database URL

## Method 1: Railway Dashboard (Easiest)

1. Go to https://railway.app/dashboard
2. Click on your project
3. Click on the PostgreSQL service (database icon)
4. Click on "Connect" tab
5. Under "Available Variables", you'll see:
   - `DATABASE_URL` (internal - what you have now)
   - `DATABASE_PUBLIC_URL` (external - what you need)
   
   OR under "Connect" you'll see connection strings for:
   - Private Network (ends with `.railway.internal`)
   - Public Network (what you need for Vercel)

## Method 2: Railway CLI

If you have Railway CLI installed:
```bash
railway login
railway link
railway variables
```

Look for `DATABASE_PUBLIC_URL` or any URL that doesn't contain `.railway.internal`

## What the URLs Look Like

❌ **Internal (won't work from Vercel)**:
```
postgresql://postgres:password@postgres.railway.internal:5432/railway
```

✅ **Public (works from anywhere)**:
```
postgresql://postgres:password@viaduct.proxy.rlwy.net:12345/railway
```
or
```
postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
```

## Important Notes

- The public URL might have a different port (not always 5432)
- The password is the same for both URLs
- Some Railway plans might not expose public URLs by default
- If you don't see a public URL, you might need to:
  1. Go to Settings in your PostgreSQL service
  2. Enable "Public networking"
  3. Wait a minute for it to provision

## After You Get the Public URL

1. Copy the entire public DATABASE_URL
2. Go to Vercel Dashboard → Settings → Environment Variables
3. Update `DATABASE_URL` with the public URL
4. Redeploy (Vercel → Deployments → Redeploy)

Your app should work immediately after this change!