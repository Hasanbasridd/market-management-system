
namespace MarketApp.API.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";

    // "staff" | "admin" | "superadmin"
    // superadmin: tüm mağazaları yönetebilir
    public string Role { get; set; } = "staff";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ── Multi-tenant: Hangi mağazaya ait? ────────────────
    // null ise superadmin (mağazaya bağlı değil)
    public int? StoreId { get; set; }
    public Store? Store { get; set; }
}