namespace MarketApp.API.Models;

public class StockMovement
{
    public int Id { get; set; }
    public string Type { get; set; } = "";
    public int Quantity { get; set; }
    public string? Note { get; set; }
    public DateTime MovedAt { get; set; } = DateTime.UtcNow;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int MovedById { get; set; }
    public User MovedBy { get; set; } = null!;
}