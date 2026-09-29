namespace MarketApp.API.DTOs;

public class ProductDto
{
    public string Name { get; set; } = "";
    public string Barcode { get; set; } = "";
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public int CategoryId { get; set; }
    public int? StoreId { get; set; }
}