# URGENT: Set Up Vercel Environment Variables

The error "Environment Variable 'DATABASE_URL' references Secret 'database_url', which does not exist" means you need to add the environment variables to Vercel.

## Quick Fix Steps:

### 1. Go to Vercel Dashboard
- Go to https://vercel.com/dashboard
- Click on your project (monger-maps)
- Click on "Settings" tab
- Click on "Environment Variables" in the left sidebar

### 2. Add These Environment Variables:

Click "Add New" and add each of these:

#### Required Variables:
1. **DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: Your PostgreSQL connection string (from Railway or your database provider)
   - Example: `postgresql://user:password@host:port/database`
   - Environment: Production, Preview, Development

2. **NEXTAUTH_SECRET**
   - Key: `NEXTAUTH_SECRET`
   - Value: Generate one at https://generate-secret.vercel.app/32
   - Environment: Production, Preview, Development

3. **NEXTAUTH_URL**
   - Key: `NEXTAUTH_URL`
   - Value: `https://your-domain.vercel.app` (or your custom domain)
   - Environment: Production, Preview, Development

#### Optional Variables (can add empty values for now):
4. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
   - Key: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Value: Your Stripe publishable key or `pk_test_dummy` for testing
   - Environment: Production, Preview, Development

5. **STRIPE_SECRET_KEY**
   - Key: `STRIPE_SECRET_KEY`
   - Value: Your Stripe secret key or `sk_test_dummy` for testing
   - Environment: Production, Preview, Development

6. **STRIPE_WEBHOOK_SECRET**
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: Your Stripe webhook secret or `whsec_dummy` for testing
   - Environment: Production, Preview, Development

7. **NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN**
   - Key: `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
   - Value: Your Mapbox token or `pk.dummy` for testing
   - Environment: Production, Preview, Development

### 3. Redeploy
After adding all environment variables:
1. Go to the "Deployments" tab
2. Find your latest deployment
3. Click the three dots menu
4. Click "Redeploy"

## Alternative: Remove Environment Variable References

If you want to deploy first and add real values later, update vercel.json: