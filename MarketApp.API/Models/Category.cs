namespace MarketApp.API.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Icon { get; set; } = "📦";

    // ── Multi-tenant ─────────────────────────────────────
    public int StoreId { get; set; }
    public Store Store { get; set; } = null!;

    public ICollection<Product> Products { get; set; } = new List<Product>();
}