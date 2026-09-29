using System.ComponentModel.DataAnnotations;

namespace MarketApp.API.Models;

/// <summary>
/// Her şube/mağaza bir Store kaydıdır.
/// Tüm veriler (Ürün, Stok, Kullanıcı) bir Store'a aittir.
/// </summary>
public class Store
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = "";       // Mağaza adı

    [MaxLength(200)]
    public string? Address { get; set; }          // Adres (opsiyonel)

    [MaxLength(20)]
    public string? Phone { get; set; }            // Telefon (opsiyonel)

    public bool IsActive { get; set; } = true;    // Mağaza aktif mi?

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation: Bu mağazaya ait kullanıcılar
    public ICollection<User> Users { get; set; } = new List<User>();

    // Navigation: Bu mağazaya ait kategoriler
    public ICollection<Category> Categories { get; set; } = new List<Category>();

    // Navigation: Bu mağazaya ait ürünler
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
