# MongerMaps Deployment Guide

This guide will help you deploy MongerMaps to Vercel (frontend) and Railway (database/backend).

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Railway account (free tier or paid)
- PostgreSQL database (will be created on Railway)

## Step 1: Prepare Your Repository

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mongermaps.git
git push -u origin main
```

## Step 2: Deploy Database on Railway

1. Go to [Railway](https://railway.app) and sign in
2. Click "New Project" → "Deploy PostgreSQL"
3. Once deployed, click on the PostgreSQL service
4. Go to "Variables" tab and copy the `DATABASE_URL`
5. Save this URL for later use

### Optional: Deploy Full App on Railway

If you want to host the entire app on Railway (not just the database):

1. In the same Railway project, click "New" → "GitHub Repo"
2. Select your mongermaps repository
3. Railway will auto-detect it's a Next.js app
4. Add these environment variables in Railway:
   - `DATABASE_URL` (from PostgreSQL service)
   - `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (will be your Railway app URL)
   - Add other optional variables as needed

## Step 3: Deploy Frontend on Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `.` (leave as is)
   - Build Command: `npm run build`
   - Install Command: `npm install --legacy-peer-deps`

5. Add Environment Variables:
   - `DATABASE_URL` (from Railway PostgreSQL)
   - `NEXTAUTH_SECRET` (same as Railway if using both)
   - `NEXTAUTH_URL` (will be `https://your-app.vercel.app`)
   - Add other variables as needed (see `.env.production.example`)

6. Click "Deploy"

## Step 4: Post-Deployment Setup

### Initialize Database

After both services are deployed:

1. In Vercel, go to your project settings
2. Functions tab → Add these environment variables if not already:
   - Ensure `DATABASE_URL` is correct
3. Run database migrations:
   ```bash
   # Option 1: Use Railway CLI
   railway run npm run db:push
   
   # Option 2: Use local connection
   DATABASE_URL="your-railway-url" npm run db:push
   ```

### Configure Domain (Optional)

1. In Vercel: Settings → Domains → Add your custom domain
2. Update `NEXTAUTH_URL` in both Vercel and Railway to match

### Set Up Webhooks (If using Stripe)

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET` in Vercel

## Environment Variables Reference

### Required for Basic Functionality

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for auth
- `NEXTAUTH_URL` - Your app's URL

### Optional Services

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - For payments
- `STRIPE_SECRET_KEY` - For payments backend
- `STRIPE_WEBHOOK_SECRET` - For Stripe webhooks
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` - For maps
- Email server variables - For sending emails
- BTCPay Server variables - For Bitcoin payments

## Deployment Options Summary

### Option 1: Vercel + Railway (Recommended)
- **Vercel**: Hosts the Next.js frontend/API
- **Railway**: Hosts PostgreSQL database
- **Pros**: Best performance, Vercel's edge network, easy scaling
- **Cons**: Two services to manage

### Option 2: Railway Only
- **Railway**: Hosts everything (app + database)
- **Pros**: Single platform, easier management
- **Cons**: No edge optimization, might be slower globally

### Option 3: Vercel + External Database
- **Vercel**: Hosts the app
- **Database**: Supabase, Neon, or other PostgreSQL provider
- **Pros**: Many free database options
- **Cons**: Another service to manage

## Troubleshooting

### Build Failures
- Ensure `npm install --legacy-peer-deps` is used
- Check all required env variables are set
- Verify DATABASE_URL format is correct

### Database Connection Issues
- Ensure Railway PostgreSQL is running
- Check if DATABASE_URL includes `?sslmode=require`
- Verify Prisma schema matches database

### Authentication Issues
- NEXTAUTH_URL must match your deployment URL
- NEXTAUTH_SECRET must be the same across services
- Use HTTPS in production

## Monitoring & Logs

- **Vercel**: Check Functions tab for API logs
- **Railway**: Check service logs in dashboard
- **Database**: Use `npm run db:studio` locally with production DATABASE_URL

## Cost Estimates

- **Vercel Free Tier**: Perfect for MVP
  - 100GB bandwidth/month
  - Serverless functions included
  
- **Railway**:
  - $5/month for starter (500 hours)
  - PostgreSQL included in usage
  - Good for small-medium apps

## Next Steps

1. Set up GitHub Actions for CI/CD
2. Configure preview deployments
3. Set up monitoring (Sentry, LogRocket)
4. Add backup strategy for database
5. Configure CDN for static assets