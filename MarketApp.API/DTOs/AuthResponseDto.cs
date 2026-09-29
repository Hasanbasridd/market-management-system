namespace MarketApp.API.DTOs;

// Login başarılı olunca döneceğimiz veri
// Token + kullanıcı bilgileri
public class AuthResponseDto
{
    public string Token { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Role { get; set; } = "";
}