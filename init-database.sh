#!/bin/bash

# Initialize database script for MongerMaps

echo "🚀 Initializing MongerMaps database..."

# Export the public DATABASE_URL
export DATABASE_URL="postgresql://postgres:EGfEnfkzZaQhjIaMpDJXVYhArkbQQSPj@yamabiko.proxy.rlwy.net:18201/railway"

# Change to the project directory
cd /workspace/mongermaps

# Generate Prisma client
echo "📦 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "🔨 Pushing database schema..."
npm run db:push

# Optional: Run seed if you have one
if [ -f "prisma/seed.ts" ]; then
    echo "🌱 Seeding database..."
    npm run db:seed
fi

echo "✅ Database initialization complete!"