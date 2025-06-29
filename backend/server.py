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
