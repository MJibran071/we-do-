#!/bin/bash

# Secure Secrets Generation Script
# Run this script to generate secure environment variables for production

set -e

echo "🔐 Generating secure secrets for production deployment..."
echo ""

# Generate secure random secrets
JWT_SECRET=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 24)
REDIS_PASSWORD=$(openssl rand -base64 24)
ENCRYPTION_KEY=$(openssl rand -base64 32)
API_KEY=$(openssl rand -base64 32)

# Create .env.production file
cat > .env.production << EOF
# Production Environment Variables
# Generated on $(date)
# KEEP THIS FILE SECURE - DO NOT COMMIT TO VERSION CONTROL

# Database Configuration
DB_USER=wedo_prod_user
DB_PASSWORD=${DB_PASSWORD}

# Redis Configuration
REDIS_PASSWORD=${REDIS_PASSWORD}

# JWT Authentication
JWT_SECRET=${JWT_SECRET}

# Encryption Key for Vault Service
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# API Keys
API_KEY=${API_KEY}
GEMINI_API_KEY=CHANGE_ME_YOUR_GEMINI_API_KEY

# Payment Providers (Update with your real keys)
STRIPE_SECRET_KEY=sk_live_CHANGE_ME
PAYPAL_CLIENT_ID=CHANGE_ME
PAYPAL_CLIENT_SECRET=CHANGE_ME

# CORS Configuration (Update with your actual domain)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
EOF

echo "✅ Secrets generated successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.production and update:"
echo "   - GEMINI_API_KEY (get from Google AI Studio)"
echo "   - STRIPE_SECRET_KEY (get from Stripe Dashboard)"
echo "   - PAYPAL credentials (get from PayPal Developer)"
echo "   - ALLOWED_ORIGINS (your actual domain)"
echo ""
echo "2. Keep .env.production secure and never commit it to git"
echo ""
echo "3. Deploy with: docker-compose --env-file .env.production -f docker-compose.prod.yml up -d"
echo ""
echo "⚠️  IMPORTANT: Store these secrets in a secure location (password manager, secrets vault)"
