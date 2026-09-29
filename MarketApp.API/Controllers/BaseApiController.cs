using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MarketApp.API.Controllers;

public class BaseApiController : ControllerBase
{
    // Token'dan giriş yapan kullanıcının ID'sini alır
    protected int GetUserId()
    {
        var idClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        return string.IsNullOrEmpty(idClaim) ? 0 : int.Parse(idClaim);
    }

    // Token'dan giriş yapan kullanıcının Mağaza ID'sini alır
    // (Superadmin ise null döner)
    protected int? GetStoreId()
    {
        var storeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "storeId")?.Value;
        if (string.IsNullOrEmpty(storeIdClaim)) return null;
        if (int.TryParse(storeIdClaim, out int id)) return id;
        return null;
    }

    // Kullanıcının Superadmin olup olmadığını kontrol eder
    protected bool IsSuperAdmin()
    {
        var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        return role == "superadmin";
    }
}
