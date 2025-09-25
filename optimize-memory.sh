#!/bin/bash
echo "🧹 Starting Memory Optimization..."

# Clear Next.js build cache
echo "Clearing .next cache..."
rm -rf .next

# Clear TypeScript build info
echo "Clearing TypeScript cache..."
rm -f tsconfig.tsbuildinfo

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Reinstall dependencies (optional, for clean slate)
# echo "Reinstalling dependencies..."
# rm -rf node_modules package-lock.json
# npm install

echo "✅ Memory optimization complete!"
echo "📊 Next steps:"
echo "1. Restart your development server: npm run dev"
echo "2. Monitor memory usage: ps aux | grep node"
echo "3. Check bundle size: npm run build"
