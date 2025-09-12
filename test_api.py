#!/usr/bin/env python3
"""
Test script to verify Django API is reading CSV data correctly
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_finance_endpoints():
    """Test finance API endpoints"""
    print("🧪 Testing Finance API Endpoints...")
    print("=" * 50)
    
    endpoints = [
        "/api/finance/dashboard/",
        "/api/finance/charts/revenue/",
        "/api/finance/charts/expenses/",
        "/api/finance/analytics/commentary/"
    ]
    
    for endpoint in endpoints:
        url = f"{BASE_URL}{endpoint}"
        print(f"\n📊 Testing: {endpoint}")
        
        try:
            response = requests.get(url, timeout=10)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Success!")
                
                # Pretty print key data
                if endpoint == "/api/finance/dashboard/":
                    if 'metrics' in data:
                        print("💰 Financial Metrics:")
                        for key, value in data['metrics'].items():
                            print(f"   {key}: {value}")
                    
                    if 'data_info' in data:
                        print("📈 Data Info:")
                        for key, value in data['data_info'].items():
                            print(f"   {key}: {value}")
                
                elif endpoint == "/api/finance/charts/revenue/":
                    if 'labels' in data and 'values' in data:
                        print(f"📊 Chart Data: {len(data['labels'])} points")
                        print(f"   Title: {data.get('title', 'N/A')}")
                        if data['labels'] and data['values']:
                            print(f"   Sample: {data['labels'][0]} = {data['values'][0]}")
                
            else:
                print("❌ Failed!")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data.get('error', 'Unknown error')}")
                except:
                    print(f"   Raw response: {response.text[:200]}...")
                    
        except requests.exceptions.ConnectionError:
            print("❌ Connection Error - Is Django server running?")
        except Exception as e:
            print(f"❌ Error: {str(e)}")

def test_other_endpoints():
    """Test other business app endpoints"""
    print("\n\n🧪 Testing Other Business Endpoints...")
    print("=" * 50)
    
    apps = ["order-journey", "marketing", "supply-chain", "hr"]
    
    for app in apps:
        url = f"{BASE_URL}/api/{app}/dashboard/"
        print(f"\n📊 Testing: {app}")
        
        try:
            response = requests.get(url, timeout=5)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Success!")
                if 'metrics' in data:
                    print(f"   Metrics: {list(data['metrics'].keys())}")
            else:
                print("❌ Failed!")
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    print("🚀 Django API Test Suite")
    print("Make sure Django server is running on http://127.0.0.1:8000")
    print()
    
    test_finance_endpoints()
    test_other_endpoints()
    
    print("\n" + "=" * 50)
    print("✅ Test suite completed!")
