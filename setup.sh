#!/bin/bash

# WeDo Platform - New Features Setup Script
# This script helps you set up all the new features

echo "🎉 WeDo Platform - New Features Setup"
echo "======================================"
echo ""

# Check Node version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version OK: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error: npm install failed"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
npx playwright install
if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Playwright install failed (optional)"
else
    echo "✅ Playwright browsers installed"
fi
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "⚙️  Creating .env.local file..."
    cat > .env.local << EOF
# Gemini API Key (required for translation)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# VAPID Public Key (required for push notifications)
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key_here

# API URL (optional, defaults to http://localhost:3000)
VITE_API_URL=http://localhost:3000
EOF
    echo "✅ Created .env.local file"
    echo "⚠️  Please update .env.local with your API keys"
else
    echo "✅ .env.local already exists"
fi
echo ""

# Run tests
echo "🧪 Running tests..."
npm test -- --run
if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Some tests failed"
else
    echo "✅ All tests passed"
fi
echo ""

# Check if icons exist
echo "🎨 Checking app icons..."
if [ ! -f public/icon-192.png ] || [ ! -f public/icon-512.png ]; then
    echo "⚠️  Warning: App icons not found"
    echo "   Generate icons at: https://realfavicongenerator.net/"
    echo "   Place them in public/ directory"
else
    echo "✅ App icons found"
fi
echo ""

# Summary
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Update .env.local with your API keys"
echo "2. Generate app icons (if needed)"
echo "3. Review documentation:"
echo "   - NEW_FEATURES_GUIDE.md"
echo "   - INTEGRATION_CHECKLIST.md"
echo "   - APP_INTEGRATION_GUIDE.md"
echo ""
echo "🚀 Quick Commands:"
echo ""
echo "  npm run dev              # Start development server"
echo "  npm test                 # Run unit tests"
echo "  npm run test:e2e         # Run E2E tests"
echo "  npm run build            # Build for production"
echo ""
echo "📖 Documentation:"
echo ""
echo "  - Feature Guide: NEW_FEATURES_GUIDE.md"
echo "  - Quick Reference: QUICK_REFERENCE.md"
echo "  - Architecture: ARCHITECTURE.md"
echo ""
echo "🎉 Happy coding!"
echo ""
