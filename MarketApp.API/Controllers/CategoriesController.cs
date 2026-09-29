using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MarketApp.API.Data;
using MarketApp.API.Models;

namespace MarketApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : BaseApiController
{
    private readonly AppDbContext _db;

    public CategoriesController(AppDbContext db)
    {
        _db = db;
    }

    // GET api/categories
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var storeId = GetStoreId();
        
        var query = _db.Categories.AsQueryable();
        
        if (storeId.HasValue)
            query = query.Where(c => c.StoreId == storeId.Value);

        var categories = await query
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Icon,
                c.StoreId,
                // Kaç ürün var bu kategoride?
                ProductCount = c.Products.Count(p => p.IsActive)
            })
            .OrderBy(c => c.Name)
            .ToListAsync();

        return Ok(categories);
    }

    // GET api/categories/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var storeId = GetStoreId();
        var query = _db.Categories.Where(c => c.Id == id);
        
        if (storeId.HasValue)
            query = query.Where(c => c.StoreId == storeId.Value);

        var category = await query
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Icon,
                c.StoreId,
                ProductCount = c.Products.Count(p => p.IsActive)
            })
            .FirstOrDefaultAsync();

        if (category == null)
            return NotFound(new { message = "Kategori bulunamadı veya bu şubeye ait değil" });

        return Ok(category);
    }

    // POST api/categories
    [HttpPost]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<IActionResult> Create([FromBody] CategoryDto dto)
    {
        var storeId = GetStoreId();
        
        // Superadmin is creating without storeId in dto? For now let's assume they provide it or we just reject if null.
        if (!storeId.HasValue && !IsSuperAdmin()) return Forbid();
        
        var targetStoreId = storeId ?? dto.StoreId ?? 0;
        if (targetStoreId == 0) return BadRequest(new { message = "StoreId gereklidir" });

        // Aynı isimde kategori var mı (bu şubede)?
        var exists = await _db.Categories.AnyAsync(c => c.Name == dto.Name && c.StoreId == targetStoreId);
        if (exists)
            return BadRequest(new { message = "Bu kategori bu şubede zaten var" });

        var category = new Category
        {
            Name = dto.Name,
            Icon = dto.Icon,
            StoreId = targetStoreId
        };

        _db.Categories.Add(category);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    // PUT api/categories/5
    [HttpPut("{id}")]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<IActionResult> Update(int id, [FromBody] CategoryDto dto)
    {
        var storeId = GetStoreId();
        var query = _db.Categories.Where(c => c.Id == id);
        if (storeId.HasValue) query = query.Where(c => c.StoreId == storeId.Value);
        
        var category = await query.FirstOrDefaultAsync();

        if (category == null)
            return NotFound(new { message = "Kategori bulunamadı" });

        category.Name = dto.Name;
        category.Icon = dto.Icon;

        await _db.SaveChangesAsync();

        return Ok(category);
    }

    // DELETE api/categories/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<IActionResult> Delete(int id)
    {
        var storeId = GetStoreId();
        var query = _db.Categories.Where(c => c.Id == id);
        if (storeId.HasValue) query = query.Where(c => c.StoreId == storeId.Value);
        
        var category = await query.FirstOrDefaultAsync();

        if (category == null)
            return NotFound(new { message = "Kategori bulunamadı" });

        // Ürünü olan kategori silinemesin
        var hasProducts = await _db.Products.AnyAsync(p => p.CategoryId == id && p.IsActive);
        if (hasProducts)
            return BadRequest(new { message = "Bu kategoriye ait ürünler var, önce ürünleri silin" });

        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Kategori silindi" });
    }
}

// DTO — sadece bu dosyada kullanılıyor
public class CategoryDto
{
    public string Name { get; set; } = "";
    public string Icon { get; set; } = "📦";
    public int? StoreId { get; set; } // superadmin gönderirse kullanılır
}