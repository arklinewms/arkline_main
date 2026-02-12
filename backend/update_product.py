import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi import HTTPException

def update_product_by_id(conn, product_id: int, item_data):
    """
    Updates a product in the database by ID.
    """
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        # Check if exists
        check_query = "SELECT id FROM public.warehouse_data WHERE id = %s"
        cursor.execute(check_query, (product_id,))
        if not cursor.fetchone():
            return {"status": "error", "message": "Product not found", "code": 404}

        # Validate duplicate SKU if SKU is being changed
        sku_check_query = "SELECT id FROM public.warehouse_data WHERE materialsku = %s AND id != %s"
        cursor.execute(sku_check_query, (item_data.materialsku, product_id))
        if cursor.fetchone():
             return {"status": "error", "message": f"Product with SKU '{item_data.materialsku}' already exists", "code": 400}

        query = """
            UPDATE public.warehouse_data 
            SET materialsku = %s, 
                mfgdate = %s, 
                expdate = %s, 
                categoryname = %s, 
                productname = %s, 
                productdescription = %s, 
                status = %s, 
                totalitemquantity = %s
            WHERE id = %s
            RETURNING id, materialsku, mfgdate, expdate, categoryname, productname, productdescription, status, totalitemquantity
        """
        cursor.execute(query, (
            item_data.materialsku, 
            item_data.mfgdate, 
            item_data.expdate, 
            item_data.categoryname, 
            item_data.productname, 
            item_data.productdescription, 
            item_data.status, 
            item_data.totalitemquantity,
            product_id
        ))
        
        updated_item = cursor.fetchone()
        conn.commit()
        return {"status": "success", "data": updated_item}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
