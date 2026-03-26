#!/bin/bash
# Quick Start Guide for Quantum Budget Optimizer

echo "🚀 Quantum Budget Optimizer - Quick Start"
echo "==========================================="
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🔥 Starting application..."
echo ""
echo "Frontend will run on:   http://localhost:5173"
echo "Backend will run on:    http://localhost:3000"
echo ""
echo "In separate terminals, you can also run:"
echo "  • npm run dev:server  (backend only)"
echo "  • npm run dev:client  (frontend only)"
echo ""

# Start development mode
npm run dev
