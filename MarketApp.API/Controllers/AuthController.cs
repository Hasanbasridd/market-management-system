using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MarketApp.API.Data;
using MarketApp.API.DTOs;
using MarketApp.API.Models;

namespace MarketApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly string _jwtKey = "MarketAppSuperGizliAnahtar2024MinimumOtuzdortKarakter!";

    public AuthController(AppDbContext db, IConfiguration config)
    {
        _db = db;
    }

    // POST api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var exists = await _db.Users.AnyAsync(u => u.Email == dto.Email);
        if (exists) return BadRequest(new { message = "Bu email zaten kayıtlı" });

        // Mağaza kontrolü (superadmin hariç)
        if (dto.Role != "superadmin" && dto.StoreId.HasValue)
        {
            var storeExists = await _db.Stores.AnyAsync(s => s.Id == dto.StoreId && s.IsActive);
            if (!storeExists) return BadRequest(new { message = "Geçersiz mağaza" });
        }

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role,
            StoreId = dto.Role == "superadmin" ? null : dto.StoreId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = GenerateToken(user);
        return Ok(new { token, user.Name, user.Email, user.Role, user.StoreId, storeName = user.Store?.Name });
    }

    // POST api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _db.Users
            .Include(u => u.Store)
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null) return Unauthorized(new { message = "Email veya şifre hatalı" });
        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Email veya şifre hatalı" });

        // Mağaza aktif mi? (superadmin için kontrol yok)
        if (user.Store != null && !user.Store.IsActive)
            return Unauthorized(new { message = "Bu mağaza devre dışı bırakılmış." });

        var token = GenerateToken(user);

        return Ok(new
        {
            token,
            user.Name,
            user.Email,
            user.Role,
            user.StoreId,
            storeName = user.Store?.Name ?? "Tüm Sistem"
        });
    }

    private string GenerateToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role),
            // StoreId'yi token içine göm — tüm controller'lar buradan okuyacak
            new Claim("storeId", user.StoreId?.ToString() ?? ""),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}