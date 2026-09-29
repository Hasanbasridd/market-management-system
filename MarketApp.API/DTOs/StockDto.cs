namespace MarketApp.API.DTOs;

// Stok hareketi oluştururken gelecek veri
public class StockMovementDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public string? Note { get; set; }
}