# Environment Variables Setup Guide

This guide explains each environment variable and how to obtain them for deployment.

## Required Variables (App won't work without these)

### 1. DATABASE_URL
**What**: PostgreSQL connection string
**Format**: `postgresql://username:password@host:port/database?sslmode=require`
**How to get**:
- **Railway**: Created automatically when you add PostgreSQL
- **Supabase**: Copy from project settings → Database
- **Neon**: Copy from connection details
- **Local**: `postgresql://postgres:password@localhost:5432/mongermaps`

### 2. NEXTAUTH_SECRET
**What**: Secret key for encrypting sessions
**How to generate**:
```bash
openssl rand -base64 32
```
**Important**: Use the same secret across all environments

### 3. NEXTAUTH_URL
**What**: Your app's public URL
**Examples**:
- Development: `http://localhost:3000`
- Vercel: `https://your-app.vercel.app`
- Railway: `https://your-app.up.railway.app`
- Custom domain: `https://mongermaps.com`

## Optional Variables (App works without these)

### Stripe Integration
**Required for**: Payment processing

#### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- Get from: Stripe Dashboard → API keys
- Starts with: `pk_test_` (test) or `pk_live_` (production)

#### STRIPE_SECRET_KEY
- Get from: Stripe Dashboard → API keys
- Starts with: `sk_test_` (test) or `sk_live_` (production)
- **Never expose this publicly!**

#### STRIPE_WEBHOOK_SECRET
- Get from: Stripe Dashboard → Webhooks → Add endpoint
- Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
- Events to listen: `checkout.session.completed`, `invoice.payment_succeeded`

### Mapbox Integration
**Required for**: Interactive maps

#### NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
- Sign up at: https://mapbox.com
- Get from: Account → Access tokens
- Create a new token with these scopes:
  - `styles:read`
  - `fonts:read`
  - `datasets:read`
  - `vision:read`

### Email Service (Choose one)

#### Option 1: SendGrid
```
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@mongermaps.com
```

#### Option 2: Postmark
```
EMAIL_SERVER_HOST=smtp.postmarkapp.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-postmark-server-token
EMAIL_SERVER_PASSWORD=your-postmark-server-token
EMAIL_FROM=noreply@mongermaps.com
```

#### Option 3: Gmail (Development only)
```
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-specific-password
EMAIL_FROM=your-email@gmail.com
```

### BTCPay Server (Bitcoin payments)
**Required for**: Bitcoin payment option

#### BTCPAY_SERVER_URL
- Your BTCPay Server instance URL
- Example: `https://btcpay.yourdomain.com`

#### BTCPAY_STORE_ID
- Get from: BTCPay Server → Stores → Your Store → Settings

#### BTCPAY_API_KEY
- Generate from: BTCPay Server → Account → API Keys
- Permissions needed: `btcpay.store.canviewinvoices`, `btcpay.store.cancreateinvoice`

### Apify (Web scraping)
**Required for**: Automated data collection

#### APIFY_TOKEN
- Sign up at: https://apify.com
- Get from: Settings → API tokens
- Free tier: 5 USD monthly credits

## Environment Setup by Platform

### Vercel
1. Go to your project → Settings → Environment Variables
2. Add each variable with its value
3. Select which environments (Production/Preview/Development)
4. Click "Save"

### Railway
1. Select your service
2. Go to "Variables" tab
3. Add each variable
4. Changes apply automatically

### Local Development
1. Copy `.env.example` to `.env`
2. Fill in the values
3. Never commit `.env` to Git!

## Testing Your Configuration

After setting up environment variables:

1. **Test Database Connection**:
```bash
npm run db:push
```

2. **Test Authentication**:
- Visit `/api/auth/signin`
- Should see NextAuth signin page

3. **Test Stripe (if configured)**:
- Use test card: 4242 4242 4242 4242
- Any future expiry date
- Any 3-digit CVC

4. **Test Email (if configured)**:
- Trigger a test email from your app
- Check logs for errors

## Security Best Practices

1. **Never expose secret keys in client-side code**
2. **Use different values for development/production**
3. **Rotate secrets regularly**
4. **Use strong, random values for secrets**
5. **Limit API key permissions to minimum required**

## Troubleshooting

### "Invalid environment variables" error
- Check all required variables are set
- Verify no trailing spaces in values
- Ensure quotes are properly escaped if needed

### Database connection fails
- Add `?sslmode=require` to DATABASE_URL for cloud databases
- Check if IP is whitelisted (some providers)
- Verify credentials are correct

### Authentication not working
- NEXTAUTH_URL must match your actual URL exactly
- NEXTAUTH_SECRET must be at least 32 characters
- Clear cookies and try again

### Payments not processing
- Verify you're using the correct Stripe keys (test vs live)
- Check webhook endpoint is accessible
- Look at Stripe Dashboard → Webhooks for errors