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
    
    # Tests for dashboard data endpoints
    
    def test_dashboard_data_endpoint(self):
        """Test the complete dashboard data endpoint"""
        response = requests.get(f"{API_URL}/dashboard/data")
        print(f"Dashboard data endpoint status: {response.status_code}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Check for expected top-level fields
        expected_fields = ["kpis", "charts", "recentActivities", "criticalAlerts", "topSuppliers", "lastUpdated"]
        for field in expected_fields:
            self.assertIn(field, data)
            print(f"  ✓ Found {field} in dashboard data")
        
        # Check KPIs structure
        kpi_fields = ["totalOrders", "pendingOrders", "totalSuppliers", "lowStockItems", 
                      "averageDeliveryTime", "serviceLevel", "costSavings", "onTimeDelivery"]
        for field in kpi_fields:
            self.assertIn(field, data["kpis"])
            print(f"  ✓ Found {field} in KPIs data")
        
        # Check charts structure
        chart_types = ["ordersTrend", "supplierPerformance", "costAnalysis", "stockLevels"]
        for chart_type in chart_types:
            self.assertIn(chart_type, data["charts"])
            self.assertIsInstance(data["charts"][chart_type], list)
            print(f"  ✓ Found {chart_type} in charts data")
        
        print("✅ Dashboard data endpoint test passed")
    
    def test_dashboard_kpis_endpoint(self):
        """Test the dashboard KPIs endpoint"""
        response = requests.get(f"{API_URL}/dashboard/kpis")
        print(f"Dashboard KPIs endpoint status: {response.status_code}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Check for expected KPI fields
        expected_fields = ["totalOrders", "pendingOrders", "totalSuppliers", "lowStockItems", 
                          "averageDeliveryTime", "serviceLevel", "costSavings", "onTimeDelivery"]
        for field in expected_fields:
            self.assertIn(field, data)
            print(f"  ✓ Found {field} in KPI data")
        
        print("✅ Dashboard KPIs endpoint test passed")
    
    def test_dashboard_charts_endpoint(self):
        """Test the dashboard charts endpoint for each chart type"""
        chart_types = ["orders_trend", "supplier_performance", "cost_analysis", "stock_levels"]
        
        for chart_type in chart_types:
            response = requests.get(f"{API_URL}/dashboard/charts/{chart_type}")
            print(f"Dashboard {chart_type} chart endpoint status: {response.status_code}")
            self.assertEqual(response.status_code, 200)
            data = response.json()
            
            # Verify data structure
            self.assertIn("data", data)
            self.assertIsInstance(data["data"], list)
            self.assertTrue(len(data["data"]) > 0, f"Chart data for {chart_type} is empty")
            
            # Check specific fields based on chart type
            if chart_type == "orders_trend":
                expected_fields = ["month", "orders", "amount", "budget"]
            elif chart_type == "supplier_performance":
                expected_fields = ["name", "onTimeDelivery", "qualityScore", "costEfficiency", "totalOrders", "reliability"]
            elif chart_type == "cost_analysis":
                expected_fields = ["category", "budget", "spent", "forecast"]
            elif chart_type == "stock_levels":
                expected_fields = ["name", "category", "current", "min", "max", "optimal", "status"]
            
            for field in expected_fields:
                self.assertIn(field, data["data"][0])
                print(f"  ✓ Found {field} in {chart_type} chart data")
            
            print(f"✅ Dashboard {chart_type} chart endpoint test passed")
    
    def test_invalid_chart_type(self):
        """Test error handling for invalid chart type"""
        response = requests.get(f"{API_URL}/dashboard/charts/invalid_type")
        print(f"Invalid chart type endpoint status: {response.status_code}")
        self.assertEqual(response.status_code, 200)  # API returns 200 with error message
        data = response.json()
        self.assertIn("error", data)
        print("✅ Invalid chart type test passed")
    
    def test_dashboard_activities_endpoint(self):
        """Test the dashboard activities endpoint"""
        response = requests.get(f"{API_URL}/dashboard/activities")
        print(f"Dashboard activities endpoint status: {response.status_code}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) > 0, "Activities list is empty")
        
        # Check for expected fields in activities
        expected_fields = ["id", "type", "title", "message", "timestamp", "priority", "user"]
        for field in expected_fields:
            self.assertIn(field, data[0])
            print(f"  ✓ Found {field} in activities data")
        
        print("✅ Dashboard activities endpoint test passed")
    
    def test_dashboard_alerts_endpoint(self):
        """Test the dashboard alerts endpoint"""
        response = requests.get(f"{API_URL}/dashboard/alerts")
        print(f"Dashboard alerts endpoint status: {response.status_code}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) > 0, "Alerts list is empty")
        
        # Check for expected fields in alerts
        expected_fields = ["id", "type", "title", "message", "priority", "read", "createdAt"]
        for field in expected_fields:
            self.assertIn(field, data[0])
            print(f"  ✓ Found {field} in alerts data")
        
        print("✅ Dashboard alerts endpoint test passed")
    
    def test_dashboard_suppliers_endpoint(self):
        """Test the dashboard suppliers endpoint"""
        response = requests.get(f"{API_URL}/dashboard/suppliers")
        print(f"Dashboard suppliers endpoint status: {response.status_code}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) > 0, "Suppliers list is empty")
        
        # Check for expected fields in suppliers
        expected_fields = ["id", "name", "category", "isActive", "totalOrders", "totalAmount", 
                          "averageDeliveryTime", "onTimeDeliveryRate", "qualityRating", "performanceScore"]
        for field in expected_fields:
            self.assertIn(field, data[0])
            print(f"  ✓ Found {field} in suppliers data")
        
        print("✅ Dashboard suppliers endpoint test passed")
        
    def test_french_localization(self):
        """Test that the API returns French-localized content"""
        # Test French months in orders trend
        response = requests.get(f"{API_URL}/dashboard/charts/orders_trend")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Check for French month names
        french_months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui"]
        months_in_response = [item["month"] for item in data["data"]]
        for month in french_months:
            self.assertIn(month, months_in_response, f"French month {month} not found in response")
            
        # Test French categories in cost analysis
        response = requests.get(f"{API_URL}/dashboard/charts/cost_analysis")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Check for French categories
        french_categories = ["Informatique", "Matériaux", "Logistique", "Services"]
        categories_in_response = [item["category"] for item in data["data"]]
        for category in french_categories:
            self.assertIn(category, categories_in_response, f"French category {category} not found in response")
            
        # Test French content in activities
        response = requests.get(f"{API_URL}/dashboard/activities")
        self.assertEqual(response.status_code, 200)
        activities = response.json()
        
        # Check for French titles and messages
        french_keywords = ["Nouvelle", "commande", "Stock", "critique", "Commande", "approuvée", "Livraison", "terminée"]
        activity_text = " ".join([f"{a['title']} {a['message']}" for a in activities])
        for keyword in french_keywords:
            self.assertIn(keyword, activity_text, f"French keyword {keyword} not found in activities")
            
        print("✅ French localization test passed")

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
    
    dashboard_tests = unittest.TestSuite()
    dashboard_tests.addTest(TestBackendAPI('test_dashboard_data_endpoint'))
    dashboard_tests.addTest(TestBackendAPI('test_dashboard_kpis_endpoint'))
    dashboard_tests.addTest(TestBackendAPI('test_dashboard_charts_endpoint'))
    dashboard_tests.addTest(TestBackendAPI('test_invalid_chart_type'))
    dashboard_tests.addTest(TestBackendAPI('test_dashboard_activities_endpoint'))
    dashboard_tests.addTest(TestBackendAPI('test_dashboard_alerts_endpoint'))
    dashboard_tests.addTest(TestBackendAPI('test_dashboard_suppliers_endpoint'))
    
    unittest.TextTestRunner().run(dashboard_tests)