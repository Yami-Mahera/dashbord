from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timedelta
import random


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Dashboard Models
class KPI(BaseModel):
    totalOrders: int
    pendingOrders: int
    totalSuppliers: int
    lowStockItems: int
    averageDeliveryTime: float
    serviceLevel: float
    costSavings: float
    onTimeDelivery: float

class OrdersTrendData(BaseModel):
    month: str
    orders: int
    amount: int
    budget: int

class SupplierPerformanceData(BaseModel):
    name: str
    onTimeDelivery: float
    qualityScore: float
    costEfficiency: float
    totalOrders: int
    reliability: str

class CostAnalysisData(BaseModel):
    category: str
    budget: int
    spent: int
    forecast: int

class StockLevelData(BaseModel):
    name: str
    category: str
    current: int
    min: int
    max: int
    optimal: int
    status: str

class ChartsData(BaseModel):
    ordersTrend: List[OrdersTrendData]
    supplierPerformance: List[SupplierPerformanceData]
    costAnalysis: List[CostAnalysisData]
    stockLevels: List[StockLevelData]

class Activity(BaseModel):
    id: int
    type: str
    title: str
    message: str
    timestamp: str
    priority: str
    user: Dict[str, Any]

class Alert(BaseModel):
    id: str
    type: str
    title: str
    message: str
    priority: str
    read: bool
    createdAt: str

class Supplier(BaseModel):
    id: str
    name: str
    category: str
    isActive: bool
    totalOrders: int
    totalAmount: float
    averageDeliveryTime: float
    onTimeDeliveryRate: float
    qualityRating: float
    performanceScore: Optional[float] = None

class DashboardData(BaseModel):
    kpis: KPI
    charts: ChartsData
    recentActivities: List[Activity]
    criticalAlerts: List[Alert]
    topSuppliers: List[Supplier]
    lastUpdated: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Mock data generators
def generate_mock_kpis() -> KPI:
    return KPI(
        totalOrders=random.randint(80, 120),
        pendingOrders=random.randint(5, 15),
        totalSuppliers=random.randint(15, 25),
        lowStockItems=random.randint(3, 8),
        averageDeliveryTime=round(random.uniform(3.5, 7.5), 1),
        serviceLevel=round(random.uniform(85.0, 95.0), 1),
        costSavings=random.randint(100000, 200000),
        onTimeDelivery=round(random.uniform(88.0, 96.0), 1)
    )

def generate_mock_orders_trend() -> List[OrdersTrendData]:
    months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui"]
    return [
        OrdersTrendData(
            month=month,
            orders=random.randint(35, 65),
            amount=random.randint(90000, 180000),
            budget=random.randint(120000, 170000)
        ) for month in months
    ]

def generate_mock_supplier_performance() -> List[SupplierPerformanceData]:
    suppliers = [
        "TechnoFrance SAS", "Global Logistics", "EuroSupply Ltd", 
        "FastDelivery SARL", "QualityFirst Inc", "ReliableGoods SA",
        "InnoTech Solutions", "PrimeMaterials"
    ]
    return [
        SupplierPerformanceData(
            name=supplier,
            onTimeDelivery=round(random.uniform(82.0, 98.0), 1),
            qualityScore=round(random.uniform(70.0, 95.0), 1),
            costEfficiency=round(random.uniform(80.0, 98.0), 1),
            totalOrders=random.randint(10, 50),
            reliability="excellent" if random.random() > 0.7 else "good" if random.random() > 0.3 else "needs_improvement"
        ) for supplier in suppliers
    ]

def generate_mock_cost_analysis() -> List[CostAnalysisData]:
    categories = [
        {"category": "Informatique", "budget": 500000},
        {"category": "Matériaux", "budget": 300000},
        {"category": "Logistique", "budget": 200000},
        {"category": "Services", "budget": 150000}
    ]
    return [
        CostAnalysisData(
            category=cat["category"],
            budget=cat["budget"],
            spent=int(cat["budget"] * random.uniform(0.7, 0.95)),
            forecast=int(cat["budget"] * random.uniform(0.85, 1.05))
        ) for cat in categories
    ]

def generate_mock_stock_levels() -> List[StockLevelData]:
    items = [
        "Serveur Dell PowerEdge", "Routeur Cisco", "Switch HP", "Ordinateur portable",
        "Écran 24 pouces", "Câbles Ethernet", "Disque dur SSD", "Mémoire RAM",
        "Palette Europe EPAL", "Cartons d'emballage"
    ]
    categories = ["Informatique", "Informatique", "Informatique", "Informatique", 
                 "Informatique", "Informatique", "Informatique", "Informatique",
                 "Logistique", "Logistique"]
    
    return [
        StockLevelData(
            name=item,
            category=categories[i],
            current=random.randint(5, 100),
            min=random.randint(10, 20),
            max=random.randint(80, 150),
            optimal=random.randint(40, 70),
            status=random.choice(["critical", "warning", "good", "good", "good"])  # Bias towards good
        ) for i, item in enumerate(items)
    ]

def generate_mock_activities() -> List[Activity]:
    activities = [
        {
            "id": 1,
            "type": "order_created",
            "title": "Nouvelle commande",
            "message": "Commande PO-2024-001 créée par Pierre Bernard",
            "priority": "medium",
            "user": {"name": "Pierre Bernard", "avatar": "/api/avatars/pierre.jpg"}
        },
        {
            "id": 2,
            "type": "stock_alert",
            "title": "Stock critique",
            "message": "Palette Europe EPAL - Stock critique (2 unités)",
            "priority": "high",
            "user": {"name": "Système", "avatar": None}
        },
        {
            "id": 3,
            "type": "order_approved",
            "title": "Commande approuvée",
            "message": "Commande PO-2024-002 approuvée par Marie Martin",
            "priority": "low",
            "user": {"name": "Marie Martin", "avatar": "/api/avatars/marie.jpg"}
        },
        {
            "id": 4,
            "type": "delivery_completed",
            "title": "Livraison terminée",
            "message": "Commande PO-2024-003 livrée avec 1 jour d'avance",
            "priority": "low",
            "user": {"name": "Global Logistics", "avatar": "/api/avatars/global.jpg"}
        }
    ]
    
    return [
        Activity(
            **activity,
            timestamp=(datetime.utcnow() - timedelta(hours=random.randint(1, 48))).isoformat()
        ) for activity in activities
    ]

def generate_mock_alerts() -> List[Alert]:
    alerts = [
        {
            "id": str(uuid.uuid4()),
            "type": "stock_low",
            "title": "Stock faible",
            "message": "Serveur Dell PowerEdge - Stock critique (3 unités restantes)",
            "priority": "critical",
            "read": False
        },
        {
            "id": str(uuid.uuid4()),
            "type": "order_delay",
            "title": "Retard de livraison",
            "message": "Commande PO-2024-005 retardée de 2 jours",
            "priority": "high",
            "read": False
        }
    ]
    
    return [
        Alert(
            **alert,
            createdAt=(datetime.utcnow() - timedelta(hours=random.randint(1, 72))).isoformat()
        ) for alert in alerts
    ]

def generate_mock_suppliers() -> List[Supplier]:
    suppliers_data = [
        {"name": "TechnoFrance SAS", "category": "Informatique"},
        {"name": "Global Logistics", "category": "Logistique"},
        {"name": "EuroSupply Ltd", "category": "Matériaux"},
        {"name": "FastDelivery SARL", "category": "Logistique"},
        {"name": "QualityFirst Inc", "category": "Informatique"},
        {"name": "ReliableGoods SA", "category": "Matériaux"},
        {"name": "InnoTech Solutions", "category": "Informatique"},
        {"name": "PrimeMaterials", "category": "Matériaux"}
    ]
    
    return [
        Supplier(
            id=str(uuid.uuid4()),
            name=supplier["name"],
            category=supplier["category"],
            isActive=True,
            totalOrders=random.randint(15, 60),
            totalAmount=random.uniform(50000, 500000),
            averageDeliveryTime=round(random.uniform(2.5, 8.0), 1),
            onTimeDeliveryRate=round(random.uniform(85.0, 98.0), 1),
            qualityRating=round(random.uniform(3.8, 5.0), 1),
            performanceScore=round(random.uniform(85.0, 95.0), 1)
        ) for supplier in suppliers_data
    ]

# Dashboard API endpoints
@api_router.get("/dashboard/data", response_model=DashboardData)
async def get_dashboard_data():
    """Get complete dashboard data"""
    kpis = generate_mock_kpis()
    charts = ChartsData(
        ordersTrend=generate_mock_orders_trend(),
        supplierPerformance=generate_mock_supplier_performance(),
        costAnalysis=generate_mock_cost_analysis(),
        stockLevels=generate_mock_stock_levels()
    )
    activities = generate_mock_activities()
    alerts = generate_mock_alerts()
    suppliers = generate_mock_suppliers()
    
    return DashboardData(
        kpis=kpis,
        charts=charts,
        recentActivities=activities,
        criticalAlerts=[alert for alert in alerts if alert.priority == "critical"],
        topSuppliers=sorted(suppliers, key=lambda x: x.performanceScore or 0, reverse=True)[:5],
        lastUpdated=datetime.utcnow().isoformat()
    )

@api_router.get("/dashboard/kpis", response_model=KPI)
async def get_dashboard_kpis():
    """Get dashboard KPIs"""
    return generate_mock_kpis()

@api_router.get("/dashboard/charts/{chart_type}")
async def get_dashboard_charts(chart_type: str):
    """Get specific chart data"""
    if chart_type == "orders_trend":
        return {"data": generate_mock_orders_trend()}
    elif chart_type == "supplier_performance":
        return {"data": generate_mock_supplier_performance()}
    elif chart_type == "cost_analysis":
        return {"data": generate_mock_cost_analysis()}
    elif chart_type == "stock_levels":
        return {"data": generate_mock_stock_levels()}
    else:
        return {"error": "Chart type not found"}

@api_router.get("/dashboard/activities", response_model=List[Activity])
async def get_dashboard_activities():
    """Get recent activities"""
    return generate_mock_activities()

@api_router.get("/dashboard/alerts", response_model=List[Alert])
async def get_dashboard_alerts():
    """Get critical alerts"""
    return generate_mock_alerts()

@api_router.get("/dashboard/suppliers", response_model=List[Supplier])
async def get_dashboard_suppliers():
    """Get supplier information"""
    return generate_mock_suppliers()

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
