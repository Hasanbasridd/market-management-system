namespace MarketApp.API.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Barcode { get; set; } = "";
    public decimal Price { get; set; }
    public int Stock { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    // ── Multi-tenant ─────────────────────────────────────
    public int StoreId { get; set; }
    public Store Store { get; set; } = null!;

    public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
}