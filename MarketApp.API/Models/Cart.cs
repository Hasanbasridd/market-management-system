using System.ComponentModel.DataAnnotations;

namespace MarketApp.API.Models;

public class Cart
{
    [Key]
    public int Id { get; set; }
    
    // Hangi kullanıcının sepeti?
    public int UserId { get; set; }
    public User User { get; set; }

    // Sepetteki ürünler
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}
