#!/bin/bash
# Test script to verify both Django and Next.js are working

echo "🧪 Testing Business Intelligence Hub Setup"
echo "==========================================="

# Test Django API
echo -e "\n1. Testing Django API..."
if curl -s -f "http://127.0.0.1:8000/api/finance/dashboard/" > /dev/null; then
    echo "✅ Django API is responding"
    echo "📊 Finance data preview:"
    curl -s "http://127.0.0.1:8000/api/finance/dashboard/" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(f'   Revenue: {data[\"metrics\"][\"total_revenue\"]}')
    print(f'   Expenses: {data[\"metrics\"][\"total_expenses\"]}')
    print(f'   Net Profit: {data[\"metrics\"][\"net_profit\"]}')
    print(f'   Records: {data[\"data_info\"][\"gl_txn_records\"]} GL transactions')
except:
    print('   Error parsing response')
"
else
    echo "❌ Django API is not responding"
    echo "   Make sure Django server is running on port 8000"
fi

# Test Next.js
echo -e "\n2. Testing Next.js Frontend..."
if curl -s -f "http://localhost:3000" > /dev/null; then
    echo "✅ Next.js is responding"
    echo "🎨 Frontend available at: http://localhost:3000"
else
    echo "❌ Next.js is not responding"
    echo "   Make sure Next.js server is running on port 3000"
fi

echo -e "\n🚀 Setup Summary:"
echo "=================="
echo "Backend (Django):  http://127.0.0.1:8000"
echo "Frontend (Next.js): http://localhost:3000"
echo "Finance Dashboard: http://localhost:3000/finance"
echo ""
echo "Ready to view your beautiful Business Intelligence Hub! 🎉"
