# BTCPay Server + Whop Payment Integration

## ✅ Integration Complete!

MongerMaps now supports **dual payment options**:
- **Whop Payments**: Card/PayPal (instant access)
- **BTCPay Server**: Bitcoin payments (maximum privacy)

## 🔗 BTCPay Webhook Setup Required

**Add this webhook URL to your BTCPay Server dashboard:**

```
https://yourdomain.com/api/btcpay/webhook
```

### Webhook Configuration:
- **Payload URL**: `https://yourdomain.com/api/btcpay/webhook`
- **Events to monitor**:
  - `InvoicePaymentSettled` ✅
  - `InvoiceProcessing` ✅
  - `InvoiceReceivedPayment` ✅
  - `InvoiceExpired` ✅
  - `InvoiceInvalid` ✅
- **Secret**: Optional (can be added to `.env.local` as `BTCPAY_WEBHOOK_SECRET`)

## 🛠️ Your BTCPay Configuration

**Already configured:**
- **Server URL**: `https://btcpay.arbvault.io`
- **Store ID**: `6JvQAYYH4f21x4AZudfWL4SCmCX1puV5w7ELzkCXUZkk`
- **API Key**: `b692264f5dee0b24e5c69ef488d13f49bdd89269`

## 💰 Payment Options Available

### Annual Membership ($99.00)
- **Whop**: Card/PayPal → Instant access
- **Bitcoin**: BTCPay Server → Privacy-focused

### Lite Membership ($19.99)
- **Whop**: Card/PayPal → Instant access
- **Bitcoin**: BTCPay Server → Privacy-focused

## 🎯 User Experience

1. **User visits** `/upgrade` page
2. **Sees both payment options** for each membership tier
3. **Chooses payment method:**
   - **"Pay with Card/PayPal"** → Redirects to Whop checkout
   - **"Pay with Bitcoin"** → Redirects to BTCPay invoice
4. **After payment** → Returns to MongerMaps with active membership

## 📊 Analytics & Tracking

**PostHog tracks all payment events:**
- `whop_payment_initiated`
- `whop_payment_success`
- `bitcoin_payment_initiated`
- `bitcoin_invoice_created`
- `bitcoin_payment_success`

## 🔐 Security Features

### Bitcoin Payments (BTCPay):
- **Zero KYC** requirements
- **No personal data** stored
- **Self-hosted** BTCPay Server
- **Webhook verification** (optional)

### Whop Payments:
- **Industry standard** security
- **PCI compliant** processing
- **Fraud protection** built-in

## 🗄️ Database Integration

**Subscription records include:**
- Payment method (Bitcoin vs. Whop)
- Invoice/payment IDs
- Membership type and level
- Lifetime access (no expiration)

## 🚀 Next Steps

1. **Add webhook URL** to BTCPay dashboard
2. **Test payments** on development server (`http://localhost:3001`)
3. **Deploy to production**
4. **Update Whop product IDs** in `/src/lib/whop.ts`:
   ```javascript
   LITE_MEMBERSHIP: 'your_actual_whop_product_id',
   ANNUAL_MEMBERSHIP: 'your_actual_whop_product_id',
   ```

## 📋 Files Created/Modified

### New Files:
- `/src/lib/btcpay.ts` - BTCPay Server utilities
- `/src/app/api/btcpay/create-invoice/route.ts` - Invoice creation API
- `/src/app/api/btcpay/webhook/route.ts` - Webhook handler
- `/src/components/bitcoin-payment-button.tsx` - Bitcoin payment component

### Modified Files:
- `/src/app/upgrade/page.tsx` - Added dual payment options
- `/src/env.js` - Added BTCPay environment variables
- `/.env.local` - BTCPay configuration
- `/.env.example` - Environment template

## 🎉 Benefits Achieved

1. **Payment Diversity**: Card, PayPal, and Bitcoin options
2. **Privacy Options**: Bitcoin for anonymous payments
3. **Instant Access**: Whop for immediate activation
4. **Self-Hosted**: BTCPay Server for Bitcoin independence
5. **Analytics**: Full tracking of all payment flows
6. **Professional UX**: Clean, branded payment interface

Your MongerMaps now offers the **ultimate payment flexibility** - from instant card payments to completely private Bitcoin transactions! 🚀