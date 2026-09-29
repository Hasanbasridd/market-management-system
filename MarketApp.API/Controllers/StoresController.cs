using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MarketApp.API.Data;
using MarketApp.API.Models;

namespace MarketApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "superadmin")]
public class StoresController : ControllerBase
{
    private readonly AppDbContext _db;
    public StoresController(AppDbContext db) => _db = db;

    // GET api/stores — Tüm mağazaları listele
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var stores = await _db.Stores
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.Address,
                s.Phone,
                s.IsActive,
                s.CreatedAt,
                UserCount = s.Users.Count,
                ProductCount = s.Products.Count
            })
            .OrderBy(s => s.Name)
            .ToListAsync();

        return Ok(stores);
    }

    // GET api/stores/5 — Tek mağaza detayı
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var store = await _db.Stores
            .Include(s => s.Users)
            .Include(s => s.Products)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (store == null) return NotFound();
        return Ok(store);
    }

    // POST api/stores — Yeni mağaza oluştur
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateStoreDto dto)
    {
        var store = new Store
        {
            Name = dto.Name,
            Address = dto.Address,
            Phone = dto.Phone,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _db.Stores.Add(store);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Mağaza oluşturuldu.", storeId = store.Id, store.Name });
    }

    // PUT api/stores/5 — Mağaza güncelle
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateStoreDto dto)
    {
        var store = await _db.Stores.FindAsync(id);
        if (store == null) return NotFound();

        store.Name = dto.Name;
        store.Address = dto.Address;
        store.Phone = dto.Phone;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Mağaza güncellendi." });
    }

    // PATCH api/stores/5/toggle — Aktif/Pasif yap
    [HttpPatch("{id}/toggle")]
    public async Task<IActionResult> Toggle(int id)
    {
        var store = await _db.Stores.FindAsync(id);
        if (store == null) return NotFound();

        store.IsActive = !store.IsActive;
        await _db.SaveChangesAsync();

        return Ok(new { message = $"Mağaza {(store.IsActive ? "aktif" : "pasif")} yapıldı.", store.IsActive });
    }

    // DELETE api/stores/5 — Mağaza sil
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var store = await _db.Stores.FindAsync(id);
        if (store == null) return NotFound();

        _db.Stores.Remove(store);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Mağaza silindi." });
    }
}

public class CreateStoreDto
{
    public string Name { get; set; } = "";
    public string? Address { get; set; }
    public string? Phone { get; set; }
}
