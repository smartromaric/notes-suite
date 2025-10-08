#!/bin/bash

echo "🛑 Stopping Notes Suite..."
echo ""

# Aller dans le dossier docker
cd "$(dirname "$0")"

docker-compose down

echo ""
echo "✅ Services stopped successfully!"
echo ""
echo "💡 To remove volumes (delete data), run:"
echo "   docker-compose down -v"
echo ""

