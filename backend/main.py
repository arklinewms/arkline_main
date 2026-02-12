from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import chatbot # Import the chatbot logic
import add_product # Import add product logic
import delete_product # Import delete product logic
import update_product # Import update product logic

# Database Connection Parameters
DB_HOST = "localhost"
DB_PORT = "5430"
DB_NAME = "canis_project_data"
DB_USER = "postgres"
DB_PASS = "P@ssw0rd@123"

# Helper to get DB connection
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Could not connect to database")

# --------------------------
# Pydantic Schemas (API models)
# --------------------------
class WarehouseDataBase(BaseModel):
    materialsku: str
    mfgdate: Optional[date]
    expdate: Optional[date]
    categoryname: str
    productname: str
    productdescription: Optional[str]
    status: str
    totalitemquantity: int

class WarehouseDataCreate(WarehouseDataBase):
    pass

class WarehouseDataResponse(WarehouseDataBase):
    id: Optional[int] = None

# --------------------------
# FastAPI App
# --------------------------
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------
# Endpoints
# --------------------------

# --------------------------
# Inventory Endpoint
# --------------------------
@app.get("/api/inventory", response_model=List[WarehouseDataResponse])
def get_inventory():
    """Fetch all warehouse data items"""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        query = """
            SELECT id, materialsku, mfgdate, expdate, categoryname, 
                   productname, productdescription, status, totalitemquantity 
            FROM public.warehouse_data
        """
        cursor.execute(query)
        items = cursor.fetchall()
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# --------------------------
# Inventory Endpoint (Create item)
# --------------------------
# --------------------------
# Inventory Endpoint (Create item)
# --------------------------
@app.post("/api/inventory", response_model=dict)
def create_item(item: WarehouseDataCreate):
    """Add a new warehouse item"""
    conn = get_db_connection()
    try:
        result = add_product.add_new_product(conn, item)
        if result["status"] == "error":
            raise HTTPException(status_code=400, detail=result["message"])
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# --------------------------
# Inventory Endpoint (Delete item)
# --------------------------
@app.delete("/api/inventory/{product_id}")
def delete_item(product_id: int):
    """Delete a warehouse item by ID"""
    conn = get_db_connection()
    try:
        result = delete_product.delete_product_by_id(conn, product_id)
        if result["status"] == "error":
            raise HTTPException(status_code=result["code"], detail=result["message"])
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# --------------------------
# Inventory Endpoint (Update item)
# --------------------------
@app.put("/api/inventory/{product_id}", response_model=dict)
def update_item(product_id: int, item: WarehouseDataCreate):
    """Update a warehouse item by ID"""
    conn = get_db_connection()
    try:
        result = update_product.update_product_by_id(conn, product_id, item)
        if result["status"] == "error":
            raise HTTPException(status_code=result["code"], detail=result["message"])
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# --------------------------
# Chatbot Endpoint
# --------------------------

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    """Process a chat message"""
    try:
        response = chatbot.process_message(request.message)
        # print(response)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @app.get("/health")
# def health_check():
#     return {"status": "ok", "service": "inventory-api-psycopg2"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
