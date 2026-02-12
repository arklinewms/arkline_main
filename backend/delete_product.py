import psycopg2
from fastapi import HTTPException

def delete_product_by_id(conn, product_id: int):
    """
    Deletes a product from the database by ID.
    """
    cursor = conn.cursor()
    try:
        # Check if exists first (optional, but good for returning 404)
        check_query = "SELECT id FROM public.warehouse_data WHERE id = %s"
        cursor.execute(check_query, (product_id,))
        if not cursor.fetchone():
            return {"status": "error", "message": "Product not found", "code": 404}

        query = "DELETE FROM public.warehouse_data WHERE id = %s"
        cursor.execute(query, (product_id,))
        conn.commit()
        
        return {"status": "success", "message": f"Product {product_id} deleted successfully"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
