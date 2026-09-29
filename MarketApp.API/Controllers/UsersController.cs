using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MarketApp.API.Data;
using System.Security.Claims;

namespace MarketApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin,superadmin")]
public class UsersController : BaseApiController
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var storeId = GetStoreId();
        var query = _db.Users.AsQueryable();

        if (storeId.HasValue)
            query = query.Where(u => u.StoreId == storeId.Value);

        var users = await query
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.Role,
                u.CreatedAt,
                u.StoreId
            })
            .OrderBy(u => u.CreatedAt)
            .ToListAsync();

        return Ok(users);
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleDto dto)
    {
        var storeId = GetStoreId();
        var query = _db.Users.Where(u => u.Id == id);
        if (storeId.HasValue) query = query.Where(u => u.StoreId == storeId.Value);

        var user = await query.FirstOrDefaultAsync();

        if (user == null)
            return NotFound(new { message = "Kullanıcı bulunamadı veya yetkiniz yok" });

        if (dto.Role != "admin" && dto.Role != "staff" && dto.Role != "superadmin")
            return BadRequest(new { message = "Geçersiz rol" });

        if (dto.Role == "superadmin" && !IsSuperAdmin())
            return Forbid("Sadece superadmin, başka bir superadmin atayabilir");

        user.Role = dto.Role;
        await _db.SaveChangesAsync();

        return Ok(new { message = "Rol güncellendi", userId = id, newRole = dto.Role });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var storeId = GetStoreId();
        var query = _db.Users.Where(u => u.Id == id);
        if (storeId.HasValue) query = query.Where(u => u.StoreId == storeId.Value);

        var user = await query.FirstOrDefaultAsync();

        if (user == null)
            return NotFound(new { message = "Kullanıcı bulunamadı veya yetkiniz yok" });

        var currentUserId = GetUserId();

        if (user.Id == currentUserId)
            return BadRequest(new { message = "Kendi hesabınızı silemezsiniz" });

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Kullanıcı silindi" });
    }
}

public class ChangeRoleDto
{
    public string Role { get; set; } = "";
}
