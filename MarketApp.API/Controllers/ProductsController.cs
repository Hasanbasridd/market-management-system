using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MarketApp.API.Data;
using MarketApp.API.DTOs;
using MarketApp.API.Models;

namespace MarketApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : BaseApiController
{
    private readonly AppDbContext _db;

    public ProductsController(AppDbContext db)
    {
        _db = db;
    }

    private static ProductResponseDto ToDto(Product p) => new ProductResponseDto
    {
        Id = p.Id,
        Name = p.Name,
        Barcode = p.Barcode,
        Price = p.Price,
        Stock = p.Stock,
        IsActive = p.IsActive,
        CreatedAt = p.CreatedAt,
        CategoryId = p.CategoryId,
        CategoryName = p.Category?.Name ?? "",
        CategoryIcon = p.Category?.Icon ?? "",
        StoreId = p.StoreId
    };

    // GET api/products
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] int? categoryId)
    {
        var storeId = GetStoreId();
        
        var query = _db.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive)
            .AsQueryable();

        if (storeId.HasValue)
            query = query.Where(p => p.StoreId == storeId.Value);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(p =>
                p.Name.Contains(search) ||
                p.Barcode.Contains(search));

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId);

        var products = await query.OrderBy(p => p.Name).ToListAsync();
        return Ok(products.Select(ToDto));
    }

    // GET api/products/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var storeId = GetStoreId();
        var query = _db.Products.Include(p => p.Category).Where(p => p.Id == id && p.IsActive);
        
        if (storeId.HasValue) query = query.Where(p => p.StoreId == storeId.Value);

        var product = await query.FirstOrDefaultAsync();

        if (product == null)
            return NotFound(new { message = "Ürün bulunamadı veya bu şubeye ait değil" });

        return Ok(ToDto(product));
    }

    // GET api/products/barcode/8690804020005
    [HttpGet("barcode/{barcode}")]
    public async Task<IActionResult> GetByBarcode(string barcode)
    {
        var storeId = GetStoreId();
        var query = _db.Products.Include(p => p.Category).Where(p => p.Barcode == barcode && p.IsActive);
        
        if (storeId.HasValue) query = query.Where(p => p.StoreId == storeId.Value);

        var product = await query.FirstOrDefaultAsync();

        if (product == null)
            return NotFound(new { message = "Bu barkoda ait ürün bulunamadı veya bu şubeye ait değil" });

        return Ok(ToDto(product));
    }

    // POST api/products
    [HttpPost]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<IActionResult> Create(ProductDto dto)
    {
        var storeId = GetStoreId();
        if (!storeId.HasValue && !IsSuperAdmin()) return Forbid();
        
        var targetStoreId = storeId ?? dto.StoreId ?? 0;
        if (targetStoreId == 0) return BadRequest(new { message = "StoreId gereklidir" });

        var categoryExists = await _db.Categories.AnyAsync(c => c.Id == dto.CategoryId && c.StoreId == targetStoreId);
        if (!categoryExists)
            return BadRequest(new { message = "Kategori bulunamadı veya bu şubeye ait değil" });

        if (!string.IsNullOrEmpty(dto.Barcode))
        {
            var barcodeExists = await _db.Products.AnyAsync(p => p.Barcode == dto.Barcode && p.StoreId == targetStoreId);
            if (barcodeExists)
                return BadRequest(new { message = "Bu barkod bu şubede zaten kayıtlı" });
        }

        var product = new Product
        {
            Name = dto.Name,
            Barcode = dto.Barcode,
            Price = dto.Price,
            Stock = dto.Stock,
            CategoryId = dto.CategoryId,
            StoreId = targetStoreId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        await _db.Entry(product).Reference(p => p.Category).LoadAsync();

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, ToDto(product));
    }

    // PUT api/products/5
    [HttpPut("{id}")]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<IActionResult> Update(int id, ProductDto dto)
    {
        var storeId = GetStoreId();
        var query = _db.Products.Include(p => p.Category).Where(p => p.Id == id);
        if (storeId.HasValue) query = query.Where(p => p.StoreId == storeId.Value);

        var product = await query.FirstOrDefaultAsync();

        if (product == null || !product.IsActive)
            return NotFound(new { message = "Ürün bulunamadı" });

        product.Name = dto.Name;
        product.Barcode = dto.Barcode;
        product.Price = dto.Price;
        product.CategoryId = dto.CategoryId;

        await _db.SaveChangesAsync();
        await _db.Entry(product).Reference(p => p.Category).LoadAsync();

        return Ok(ToDto(product));
    }

    // DELETE api/products/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<IActionResult> Delete(int id)
    {
        var storeId = GetStoreId();
        var query = _db.Products.Where(p => p.Id == id);
        if (storeId.HasValue) query = query.Where(p => p.StoreId == storeId.Value);

        var product = await query.FirstOrDefaultAsync();

        if (product == null || !product.IsActive)
            return NotFound(new { message = "Ürün bulunamadı" });

        product.IsActive = false;
        await _db.SaveChangesAsync();

        return Ok(new { message = "Ürün silindi" });
    }
}