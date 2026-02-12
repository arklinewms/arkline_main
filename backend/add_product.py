import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi import HTTPException

def add_new_product(conn, item_data):
    """
    Adds a new product to the database.
    Checks for duplicate SKU before insertion.
    """
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        # Check for duplicate SKU
        check_query = "SELECT id FROM public.warehouse_data WHERE materialsku = %s"
        cursor.execute(check_query, (item_data.materialsku,))
        existing_item = cursor.fetchone()

        if existing_item:
            return {"status": "error", "message": f"SKU '{item_data.materialsku}' already exists."}

        # Insert new product
        insert_query = """
            INSERT INTO public.warehouse_data 
            (materialsku, mfgdate, expdate, categoryname, productname, productdescription, status, totalitemquantity)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, materialsku, mfgdate, expdate, categoryname, productname, productdescription, status, totalitemquantity
        """
        cursor.execute(insert_query, (
            item_data.materialsku, 
            item_data.mfgdate, 
            item_data.expdate, 
            item_data.categoryname, 
            item_data.productname, 
            item_data.productdescription, 
            item_data.status, 
            item_data.totalitemquantity
        ))
        
        new_item = cursor.fetchone()
        conn.commit()
        return {"status": "success", "data": new_item}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
