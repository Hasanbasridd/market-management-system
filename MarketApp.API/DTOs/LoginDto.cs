namespace MarketApp.API.DTOs;

// Kullanıcıdan gelecek veri şekli
// Sadece bu iki alan bekliyoruz, fazlası yok
public class LoginDto
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}