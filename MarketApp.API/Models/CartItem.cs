using System.ComponentModel.DataAnnotations;

namespace MarketApp.API.Models;

public class CartItem
{
    [Key]
    public int Id { get; set; }

    public int CartId { get; set; }
    public Cart Cart { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; }

    // Kaç adet alındı?
    public int Quantity { get; set; }
}
