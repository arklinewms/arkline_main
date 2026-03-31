// WarehouseApi.cs — Single file .NET 8 Minimal API
// Runs continuously on port 5000
// DB config via .env file
// 2 endpoints: /total-inventory and /orders-processed

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Npgsql;
using Dapper;

// ── Load .env ─────────────────────────────────────────────────
var envPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
if (File.Exists(envPath))
{
    foreach (var line in File.ReadAllLines(envPath))
    {
        if (string.IsNullOrWhiteSpace(line) || line.StartsWith("#")) continue;
        var parts = line.Split('=', 2);
        if (parts.Length == 2)
            Environment.SetEnvironmentVariable(parts[0].Trim(), parts[1].Trim());
    }
}

var connectionString =
    $"Host={Env("DB_HOST")};" +
    $"Port={Env("DB_PORT")};" +
    $"Database={Env("DB_NAME")};" +
    $"Username={Env("DB_USER")};" +
    $"Password={Env("DB_PASS")};";

// ── App setup ─────────────────────────────────────────────────
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors();

// ── Endpoint 1: Total Inventory ───────────────────────────────
// All records that are NOT Shipped (still in warehouse)
app.MapGet("/total-inventory", async () =>
{
    const string sql = """
        SELECT COUNT(*) AS total_records,
               COALESCE(SUM(totalitemquantity), 0) AS total_quantity
        FROM inventory_data
        WHERE status != 'Shipped';
        """;

    await using var conn = new NpgsqlConnection(connectionString);
    await conn.OpenAsync();
    await using var cmd = new NpgsqlCommand(sql, conn);
    await using var reader = await cmd.ExecuteReaderAsync();
    await reader.ReadAsync();

    return Results.Json(new
    {
        total_records   = reader.GetInt64(0),
        total_quantity  = reader.GetInt64(1),
        filter          = "status != 'Shipped'"
    });
});

// ── Endpoint 2: Orders Processed ─────────────────────────────
// Only Shipped orders
app.MapGet("/inbound", async () =>
{
    const string sql = """
        SELECT COUNT(*) AS order_count,
               COALESCE(SUM(totalitemquantity), 0) AS total_quantity
        FROM inventory_data
        WHERE status = 'Pending';
        """;

    await using var conn = new NpgsqlConnection(connectionString);
    await conn.OpenAsync();
    await using var cmd = new NpgsqlCommand(sql, conn);
    await using var reader = await cmd.ExecuteReaderAsync();
    await reader.ReadAsync();

    return Results.Json(new
    {
        order_count    = reader.GetInt64(0),
        total_quantity = reader.GetInt64(1),
        filter         = "status = 'Pending'"
    });
});


// ── Endpoint 3: Inbound Items ───────────────────────────────
// Items entering warehouse (Pending orders)

app.MapGet("/outbound", async () =>
{
    const string sql = """
        SELECT COUNT(*) AS inbound_orders,
               COALESCE(SUM(orderitemquantity),0) AS inbound_quantity
        FROM inventory_data
        WHERE status = 'Pending' OR
         status = 'Shipped';
        """;

    await using var conn = new NpgsqlConnection(connectionString);
    await conn.OpenAsync();

    await using var cmd = new NpgsqlCommand(sql, conn);
    await using var reader = await cmd.ExecuteReaderAsync();

    await reader.ReadAsync();

    return Results.Json(new
    {
        inbound_orders = reader.GetInt64(0),
        inbound_quantity = reader.GetInt64(1),
        filter = "status = 'Shipped'"
    });
});


// ── Endpoint 4: Outbound Items ───────────────────────────────
// Items leaving warehouse

app.MapGet("/Canceled", async () =>
{
    const string sql = """
        SELECT COUNT(*) AS outbound_orders,
               COALESCE(SUM(orderitemquantity),0) AS outbound_quantity
        FROM inventory_data
        WHERE status = 'Canceled';
        """;

    await using var conn = new NpgsqlConnection(connectionString);
    await conn.OpenAsync();

    await using var cmd = new NpgsqlCommand(sql, conn);
    await using var reader = await cmd.ExecuteReaderAsync();

    await reader.ReadAsync();

    return Results.Json(new
    {
        outbound_orders = reader.GetInt64(0),
        outbound_quantity = reader.GetInt64(1),
        filter = "status = 'Canceled'"
    });
});

// ── Endpoint 5: Get Inventory ───────────────────────────────
app.MapGet("/api/inventory", async () =>
{
    try
    {
        const string sql = """
            SELECT id, materialsku, mfgdate, expdate, categoryname, 
                   productname, productdescription, status, totalitemquantity 
            FROM inventory_data
            """;

        await using var conn = new NpgsqlConnection(connectionString);
        var list = await conn.QueryAsync<WarehouseDataResponse>(sql);
        return Results.Json(list);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.ToString());
    }
});

// ── Endpoint 6: Create Item ───────────────────────────────────
app.MapPost("/api/inventory", async (WarehouseDataCreate item) =>
{
    await using var conn = new NpgsqlConnection(connectionString);
    
    var existingId = await conn.ExecuteScalarAsync<int?>(
        "SELECT id FROM inventory_data WHERE materialsku = @materialsku", new { item.materialsku });
    
    if (existingId != null)
        return Results.BadRequest(new { status = "error", message = $"SKU '{item.materialsku}' already exists." });
    
    const string insertSql = """
        INSERT INTO inventory_data 
        (materialsku, mfgdate, expdate, categoryname, productname, productdescription, status, totalitemquantity)
        VALUES (@materialsku, @mfgdate, @expdate, @categoryname, @productname, @productdescription, @status, @totalitemquantity)
        RETURNING id;
        """;
        
    var newId = await conn.ExecuteScalarAsync<int>(insertSql, item);
    
    var responseData = new WarehouseDataResponse
    {
        id = newId,
        materialsku = item.materialsku,
        mfgdate = item.mfgdate,
        expdate = item.expdate,
        categoryname = item.categoryname,
        productname = item.productname,
        productdescription = item.productdescription,
        status = item.status,
        totalitemquantity = item.totalitemquantity
    };
    
    return Results.Json(new { status = "success", data = responseData });
});

// ── Endpoint 7: Delete Item ───────────────────────────────────
app.MapDelete("/api/inventory/{product_id}", async (int product_id) =>
{
    await using var conn = new NpgsqlConnection(connectionString);

    var existingId = await conn.ExecuteScalarAsync<int?>(
        "SELECT id FROM inventory_data WHERE id = @product_id", new { product_id });

    if (existingId == null)
        return Results.NotFound(new { status = "error", message = "Product not found", code = 404 });

    await conn.ExecuteAsync("DELETE FROM inventory_data WHERE id = @product_id", new { product_id });

    return Results.Json(new { status = "success", message = $"Product {product_id} deleted successfully" });
});

// ── Endpoint 8: Update Item ───────────────────────────────────
app.MapPut("/api/inventory/{product_id}", async (int product_id, WarehouseDataCreate item) =>
{
    await using var conn = new NpgsqlConnection(connectionString);

    var existingId = await conn.ExecuteScalarAsync<int?>(
        "SELECT id FROM inventory_data WHERE id = @product_id", new { product_id });

    if (existingId == null)
        return Results.NotFound(new { status = "error", message = "Product not found", code = 404 });

    var skuCheck = await conn.ExecuteScalarAsync<int?>(
        "SELECT id FROM inventory_data WHERE materialsku = @materialsku AND id != @product_id", 
        new { item.materialsku, product_id });

    if (skuCheck != null)
         return Results.BadRequest(new { status = "error", message = $"Product with SKU '{item.materialsku}' already exists", code = 400 });

    const string updateSql = """
        UPDATE inventory_data 
        SET materialsku = @materialsku, 
            mfgdate = @mfgdate, 
            expdate = @expdate, 
            categoryname = @categoryname, 
            productname = @productname, 
            productdescription = @productdescription, 
            status = @status, 
            totalitemquantity = @totalitemquantity
        WHERE id = @product_id;
        """;
        
    // Combine item parameter with product_id.
    var parameters = new DynamicParameters(item);
    parameters.Add("product_id", product_id);

    await conn.ExecuteAsync(updateSql, parameters);

    var responseData = new WarehouseDataResponse
    {
        id = product_id,
        materialsku = item.materialsku,
        mfgdate = item.mfgdate,
        expdate = item.expdate,
        categoryname = item.categoryname,
        productname = item.productname,
        productdescription = item.productdescription,
        status = item.status,
        totalitemquantity = item.totalitemquantity
    };

    return Results.Json(new { status = "success", data = responseData });
});

// ── Endpoint 9: Chatbot ───────────────────────────────────────
app.MapPost("/api/chat", (ChatRequest request) =>
{
    var msg = request.message?.ToLower() ?? "";
    return Results.Json(new { response = "Hello! I am your Canis AI assistant. How can I help you manage your warehouse today?" });
});

// ── Run ───────────────────────────────────────────────────────
Console.WriteLine("Warehouse API running on http://localhost:5000");
app.Run("http://0.0.0.0:5000");

// ── Helper ────────────────────────────────────────────────────
static string Env(string key) =>
    Environment.GetEnvironmentVariable(key)
    ?? throw new Exception($"Missing .env key: {key}");

// ── Models ────────────────────────────────────────────────────
public class WarehouseDataCreate
{
    public string materialsku { get; set; } = "";
    public DateTime? mfgdate { get; set; }
    public DateTime? expdate { get; set; }
    public string categoryname { get; set; } = "";
    public string productname { get; set; } = "";
    public string? productdescription { get; set; }
    public string status { get; set; } = "";
    public int totalitemquantity { get; set; }
}

public class WarehouseDataResponse : WarehouseDataCreate
{
    public int id { get; set; }
}

public class ChatRequest
{
    public string message { get; set; } = "";
}
