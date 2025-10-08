#!/bin/bash

echo "🐳 Starting Notes Suite with Docker..."
echo ""

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Vérifier que Docker Compose est installé
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Aller dans le dossier docker
cd "$(dirname "$0")"

echo "📦 Building images..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "✅ Services started successfully!"
echo ""
echo "📍 Access points:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend:  http://localhost:9090"
echo "   - API Docs: http://localhost:9090/swagger-ui.html"
echo ""
echo "📋 Useful commands:"
echo "   - View logs:    docker-compose logs -f"
echo "   - Stop:         docker-compose down"
echo "   - Restart:      docker-compose restart"
echo ""

