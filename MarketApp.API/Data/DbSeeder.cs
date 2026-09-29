using MarketApp.API.Models;

namespace MarketApp.API.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        // Zaten veri varsa tekrar ekleme
        if (db.Stores.Any()) return;

        // ── 1. MAĞAZALAR ──────────────────────────────────────
        var merkez = new Store { Name = "Merkez Şube", Address = "İstanbul, Kadıköy", Phone = "0216 111 22 33" };
        var besikas = new Store { Name = "Beşiktaş Şube", Address = "İstanbul, Beşiktaş", Phone = "0212 444 55 66" };

        db.Stores.AddRange(merkez, besikas);
        db.SaveChanges();

        // ── 2. KATEGORİLER (Her mağaza için ayrı) ────────────
        var catIcecek  = new Category { Name = "İçecekler",    Icon = "🥤", StoreId = merkez.Id };
        var catAtistir = new Category { Name = "Atıştırmalık", Icon = "🍿", StoreId = merkez.Id };
        var catSut     = new Category { Name = "Süt Ürünleri", Icon = "🥛", StoreId = merkez.Id };
        var catTemizlik = new Category { Name = "Temizlik",    Icon = "🧹", StoreId = merkez.Id };
        var catB1      = new Category { Name = "İçecekler",    Icon = "🥤", StoreId = besikas.Id };
        var catB2      = new Category { Name = "Atıştırmalık", Icon = "🍿", StoreId = besikas.Id };

        db.Categories.AddRange(catIcecek, catAtistir, catSut, catTemizlik, catB1, catB2);
        db.SaveChanges();

        // ── 3. ÜRÜNLER ────────────────────────────────────────
        db.Products.AddRange(
            new Product { Name = "Coca Cola 1L",      Barcode = "8690804020005", Price = 45.90m, Stock = 50, CategoryId = catIcecek.Id,  StoreId = merkez.Id },
            new Product { Name = "Fanta Portakal 1L", Barcode = "8690804020012", Price = 43.90m, Stock = 30, CategoryId = catIcecek.Id,  StoreId = merkez.Id },
            new Product { Name = "Su 0.5L",           Barcode = "8690804020019", Price = 8.50m,  Stock = 200, CategoryId = catIcecek.Id, StoreId = merkez.Id },
            new Product { Name = "Lays Klasik",       Barcode = "8690557020011", Price = 38.00m, Stock = 75, CategoryId = catAtistir.Id, StoreId = merkez.Id },
            new Product { Name = "Çikolata Fındıklı", Barcode = "8690557020028", Price = 55.00m, Stock = 30, CategoryId = catAtistir.Id, StoreId = merkez.Id },
            new Product { Name = "Süt 1L",            Barcode = "8690804030001", Price = 32.00m, Stock = 40, CategoryId = catSut.Id,     StoreId = merkez.Id },
            new Product { Name = "Yoğurt 500g",       Barcode = "8690804030008", Price = 28.00m, Stock = 25, CategoryId = catSut.Id,     StoreId = merkez.Id },
            new Product { Name = "Deterjan 1kg",      Barcode = "8690804040001", Price = 85.00m, Stock = 8,  CategoryId = catTemizlik.Id, StoreId = merkez.Id },
            // Beşiktaş şube ürünleri
            new Product { Name = "Pepsi 1L",          Barcode = "8690804099001", Price = 44.00m, Stock = 60, CategoryId = catB1.Id, StoreId = besikas.Id },
            new Product { Name = "Bisküvi",           Barcode = "8690557020035", Price = 22.00m, Stock = 80, CategoryId = catB2.Id, StoreId = besikas.Id }
        );
        db.SaveChanges();

        // ── 4. KULLANICILAR ───────────────────────────────────
        db.Users.AddRange(
            // SuperAdmin — mağazasız (tüm sistemi görür)
            new User
            {
                Name = "Super Admin",
                Email = "super@market.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("super123"),
                Role = "superadmin",
                StoreId = null,
                CreatedAt = DateTime.UtcNow
            },
            // Merkez yöneticisi
            new User
            {
                Name = "Hasan",
                Email = "hasan@market.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123"),
                Role = "admin",
                StoreId = merkez.Id,
                CreatedAt = DateTime.UtcNow
            },
            // Beşiktaş yöneticisi
            new User
            {
                Name = "Beşiktaş Admin",
                Email = "besiktas@market.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123"),
                Role = "admin",
                StoreId = besikas.Id,
                CreatedAt = DateTime.UtcNow
            }
        );
        db.SaveChanges();
    }
}