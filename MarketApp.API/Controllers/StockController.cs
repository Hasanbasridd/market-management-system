using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using MarketApp.API.Data;
using MarketApp.API.DTOs;
using MarketApp.API.Models;

namespace MarketApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StockController : BaseApiController
{
    private readonly AppDbContext _db;

    public StockController(AppDbContext db)
    {
        _db = db;
    }

    // ── STOK GİRİŞİ ─────────────────────────────────────────
    [HttpPost("in")]
    public async Task<IActionResult> StockIn(StockMovementDto dto)
    {
        var storeId = GetStoreId();
        var query = _db.Products.Where(p => p.Id == dto.ProductId && p.IsActive);
        if (storeId.HasValue) query = query.Where(p => p.StoreId == storeId.Value);

        var product = await query.FirstOrDefaultAsync();

        if (product == null)
            return NotFound(new { message = "Ürün bulunamadı veya bu şubeye ait değil" });

        if (dto.Quantity <= 0)
            return BadRequest(new { message = "Miktar 0'dan büyük olmalı" });

        product.Stock += dto.Quantity;

        var movement = new StockMovement
        {
            ProductId = dto.ProductId,
            Type = "in",
            Quantity = dto.Quantity,
            Note = dto.Note,
            MovedById = GetUserId(),
            MovedAt = DateTime.UtcNow
        };

        _db.StockMovements.Add(movement);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = $"{dto.Quantity} adet giriş yapıldı",
            productName = product.Name,
            newStock = product.Stock
        });
    }

    // ── STOK ÇIKIŞI ─────────────────────────────────────────
    [HttpPost("out")]
    public async Task<IActionResult> StockOut(StockMovementDto dto)
    {
        var storeId = GetStoreId();
        var query = _db.Products.Where(p => p.Id == dto.ProductId && p.IsActive);
        if (storeId.HasValue) query = query.Where(p => p.StoreId == storeId.Value);

        var product = await query.FirstOrDefaultAsync();

        if (product == null)
            return NotFound(new { message = "Ürün bulunamadı veya bu şubeye ait değil" });

        if (dto.Quantity <= 0)
            return BadRequest(new { message = "Miktar 0'dan büyük olmalı" });

        if (product.Stock < dto.Quantity)
            return BadRequest(new
            {
                message = "Yetersiz stok",
                currentStock = product.Stock,
                requested = dto.Quantity
            });

        product.Stock -= dto.Quantity;

        var movement = new StockMovement
        {
            ProductId = dto.ProductId,
            Type = "out",
            Quantity = dto.Quantity,
            Note = dto.Note,
            MovedById = GetUserId(),
            MovedAt = DateTime.UtcNow
        };

        _db.StockMovements.Add(movement);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = $"{dto.Quantity} adet çıkış yapıldı",
            productName = product.Name,
            newStock = product.Stock
        });
    }

    // ── STOK HAREKETLERİ ────────────────────────────────────
    [HttpGet("movements")]
    public async Task<IActionResult> GetMovements([FromQuery] int? productId)
    {
        var storeId = GetStoreId();

        var query = _db.StockMovements
            .Include(sm => sm.Product)
            .Include(sm => sm.MovedBy)
            .AsQueryable();

        // Sadece kullanıcının yetkili olduğu mağazanın hareketleri
        if (storeId.HasValue)
            query = query.Where(sm => sm.Product.StoreId == storeId.Value);

        if (productId.HasValue)
            query = query.Where(sm => sm.ProductId == productId);

        var movements = await query
            .OrderByDescending(sm => sm.MovedAt)
            .Take(100)
            .Select(sm => new
            {
                sm.Id,
                sm.Type,
                sm.Quantity,
                sm.Note,
                sm.MovedAt,
                ProductName = sm.Product.Name,
                MovedByName = sm.MovedBy.Name,
                StoreId = sm.Product.StoreId
            })
            .ToListAsync();

        return Ok(movements);
    }

    // ── DÜŞÜK STOK UYARISI ──────────────────────────────────
    [HttpGet("low")]
    public async Task<IActionResult> GetLowStock([FromQuery] int threshold = 10)
    {
        var storeId = GetStoreId();

        var query = _db.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive && p.Stock <= threshold);

        if (storeId.HasValue)
            query = query.Where(p => p.StoreId == storeId.Value);

        var lowStock = await query
            .OrderBy(p => p.Stock)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Stock,
                CategoryName = p.Category.Name,
                StoreId = p.StoreId
            })
            .ToListAsync();

        return Ok(lowStock);
    }
}