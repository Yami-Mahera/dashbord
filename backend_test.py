#!/usr/bin/env python3
import requests
import json
import unittest
import os
from dotenv import load_dotenv
import sys

# Load environment variables from frontend .env file to get the backend URL
load_dotenv('/app/frontend/.env')

# Get the backend URL from environment variables
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL')
if not BACKEND_URL:
    print("Error: REACT_APP_BACKEND_URL not found in environment variables")
    sys.exit(1)

API_URL = f"{BACKEND_URL}/api"
print(f"Testing API at: {API_URL}")

class TestBackendAPI(unittest.TestCase):
    
    def test_root_endpoint(self):
        """Test the root API endpoint"""
        response = requests.get(f"{API_URL}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data, {"message": "Hello World"})
        print("✅ Root endpoint test passed")
    
    def test_status_endpoint_post(self):
        """Test creating a status check"""
        payload = {"client_name": "test_client"}
        response = requests.post(f"{API_URL}/status", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["client_name"], "test_client")
        self.assertIn("id", data)
        self.assertIn("timestamp", data)
        print("✅ Status POST endpoint test passed")
    
    def test_status_endpoint_get(self):
        """Test getting status checks"""
        response = requests.get(f"{API_URL}/status")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        if len(data) > 0:
            self.assertIn("client_name", data[0])
            self.assertIn("id", data[0])
            self.assertIn("timestamp", data[0])
        print("✅ Status GET endpoint test passed")
    
    def test_cors_headers(self):
        """Test CORS headers are properly set"""
        headers = {
            "Origin": "http://example.com",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Content-Type"
        }
        response = requests.options(f"{API_URL}", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertIn("access-control-allow-origin", response.headers)
        self.assertEqual(response.headers["access-control-allow-origin"], "*")
        print("✅ CORS headers test passed")
    
    def test_nonexistent_endpoint(self):
        """Test error handling for non-existent endpoint"""
        response = requests.get(f"{API_URL}/nonexistent")
        self.assertEqual(response.status_code, 404)
        print("✅ Non-existent endpoint test passed")
    
    # Tests for expected dashboard data endpoints
    
    def test_dashboard_kpis_endpoint(self):
        """Test the dashboard KPIs endpoint"""
        response = requests.get(f"{API_URL}/dashboard/kpis")
        print(f"Dashboard KPIs endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            # Check for expected KPI fields
            expected_fields = ["orders", "suppliers", "stock_levels", "delivery_metrics"]
            for field in expected_fields:
                if field in data:
                    print(f"  ✓ Found {field} in KPI data")
                else:
                    print(f"  ✗ Missing {field} in KPI data")
        else:
            print("  ✗ Dashboard KPIs endpoint not implemented or returning error")
    
    def test_dashboard_charts_endpoint(self):
        """Test the dashboard charts endpoint"""
        chart_types = ["orders_trend", "supplier_performance", "cost_analysis", "stock_levels"]
        
        for chart_type in chart_types:
            response = requests.get(f"{API_URL}/dashboard/charts/{chart_type}")
            print(f"Dashboard {chart_type} chart endpoint status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) or isinstance(data, list):
                    print(f"  ✓ {chart_type} chart returns valid data")
                else:
                    print(f"  ✗ {chart_type} chart returns invalid data format")
            else:
                print(f"  ✗ Dashboard {chart_type} chart endpoint not implemented or returning error")
    
    def test_dashboard_activities_endpoint(self):
        """Test the dashboard activities endpoint"""
        response = requests.get(f"{API_URL}/dashboard/activities")
        print(f"Dashboard activities endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                if len(data) > 0:
                    expected_fields = ["id", "type", "description", "timestamp"]
                    for field in expected_fields:
                        if field in data[0]:
                            print(f"  ✓ Found {field} in activities data")
                        else:
                            print(f"  ✗ Missing {field} in activities data")
                else:
                    print("  ✓ Activities list is empty but valid")
            else:
                print("  ✗ Activities endpoint returns invalid data format")
        else:
            print("  ✗ Dashboard activities endpoint not implemented or returning error")
    
    def test_dashboard_alerts_endpoint(self):
        """Test the dashboard alerts endpoint"""
        response = requests.get(f"{API_URL}/dashboard/alerts")
        print(f"Dashboard alerts endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                if len(data) > 0:
                    expected_fields = ["id", "severity", "message", "timestamp"]
                    for field in expected_fields:
                        if field in data[0]:
                            print(f"  ✓ Found {field} in alerts data")
                        else:
                            print(f"  ✗ Missing {field} in alerts data")
                else:
                    print("  ✓ Alerts list is empty but valid")
            else:
                print("  ✗ Alerts endpoint returns invalid data format")
        else:
            print("  ✗ Dashboard alerts endpoint not implemented or returning error")
    
    def test_dashboard_suppliers_endpoint(self):
        """Test the dashboard suppliers endpoint"""
        response = requests.get(f"{API_URL}/dashboard/suppliers")
        print(f"Dashboard suppliers endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                if len(data) > 0:
                    expected_fields = ["id", "name", "performance_score", "on_time_delivery_rate", "quality_rating"]
                    for field in expected_fields:
                        if field in data[0]:
                            print(f"  ✓ Found {field} in suppliers data")
                        else:
                            print(f"  ✗ Missing {field} in suppliers data")
                else:
                    print("  ✓ Suppliers list is empty but valid")
            else:
                print("  ✗ Suppliers endpoint returns invalid data format")
        else:
            print("  ✗ Dashboard suppliers endpoint not implemented or returning error")

if __name__ == "__main__":
    # Run the basic API tests first
    basic_tests = unittest.TestSuite()
    basic_tests.addTest(TestBackendAPI('test_root_endpoint'))
    basic_tests.addTest(TestBackendAPI('test_status_endpoint_post'))
    basic_tests.addTest(TestBackendAPI('test_status_endpoint_get'))
    basic_tests.addTest(TestBackendAPI('test_cors_headers'))
    basic_tests.addTest(TestBackendAPI('test_nonexistent_endpoint'))
    
    print("\n=== Running Basic API Tests ===")
    unittest.TextTestRunner().run(basic_tests)
    
    # Run the dashboard-specific tests
    print("\n=== Running Dashboard API Tests ===")
    print("Note: These tests check for expected dashboard endpoints that may not be implemented yet")
    
    test = TestBackendAPI()
    test.test_dashboard_kpis_endpoint()
    test.test_dashboard_charts_endpoint()
    test.test_dashboard_activities_endpoint()
    test.test_dashboard_alerts_endpoint()
    test.test_dashboard_suppliers_endpoint()