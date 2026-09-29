using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MarketApp.API.Data;
using MarketApp.API.Models;
using System.Security.Claims;

namespace MarketApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : BaseApiController
{
    private readonly AppDbContext _db;

    public CartController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyCart()
    {
        var userId = GetUserId();
        
        var cart = await _db.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            return Ok(new { Items = new List<object>() }); // Avoid empty cart saves if not needed, but original created it.

        return Ok(cart);
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
    {
        var userId = GetUserId();
        var storeId = GetStoreId();
        
        var product = await _db.Products.FindAsync(dto.ProductId);
        if (product == null) return NotFound("Ürün bulunamadı.");
        
        if (storeId.HasValue && product.StoreId != storeId.Value)
            return Forbid("Bu ürün sizin şubenize ait değil.");

        if (product.Stock < dto.Quantity) return BadRequest("Yeterli stok yok.");

        var cart = await _db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            _db.Carts.Add(cart);
        }

        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == dto.ProductId);
        if (existingItem != null)
        {
            existingItem.Quantity += dto.Quantity;
        }
        else
        {
            cart.Items.Add(new CartItem { ProductId = dto.ProductId, Quantity = dto.Quantity });
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Ürün sepete eklendi." });
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout()
    {
        var userId = GetUserId();
        var cart = await _db.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null || !cart.Items.Any())
            return BadRequest("Sepetiniz boş.");

        var user = await _db.Users.FindAsync(userId);
        
        var order = new Order
        {
            UserId = userId,
            StoreId = user?.StoreId ?? cart.Items.First().Product.StoreId,
            CreatedAt = DateTime.UtcNow,
            TotalAmount = cart.Items.Sum(i => i.Product.Price * i.Quantity),
            Items = cart.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                Quantity = i.Quantity,
                UnitPrice = i.Product.Price
            }).ToList()
        };

        _db.Orders.Add(order);

        foreach (var item in cart.Items)
        {
            if (item.Product.Stock < item.Quantity)
                return BadRequest($"{item.Product.Name} için yeterli stok kalmadı.");

            item.Product.Stock -= item.Quantity;
            
            _db.StockMovements.Add(new StockMovement
            {
                ProductId = item.ProductId,
                Quantity = -item.Quantity,
                Type = "Satış",
                MovedAt = DateTime.UtcNow,
                MovedById = userId
            });
        }

        _db.CartItems.RemoveRange(cart.Items);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Satın alma başarılı! Stoklar güncellendi.", orderId = order.Id });
    }
}

public class AddToCartDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}
