<div align="center">
  <img src="https://img.icons8.com/color/96/000000/shop.png" alt="MarketApp Logo" width="80" />
  <h1>Market Management System (SaaS)</h1>
  <p>Modern, Multi-Tenant, Full-Stack Market & Inventory Management Application</p>

  <p>
    <a href="#"><img src="https://img.shields.io/badge/.NET_9.0-512BD4?style=flat-square&logo=dotnet&logoColor=white" alt=".NET 9"></a>
    <a href="#"><img src="https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"></a>
    <a href="#"><img src="https://img.shields.io/badge/SQL_Server-CC2927?style=flat-square&logo=microsoftsqlserver&logoColor=white" alt="SQL Server"></a>
    <a href="#"><img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"></a>
  </p>
</div>

<br />

## 📖 Hakkında (About)

**Market Management System**, çoklu şube (multi-tenant) yapısına sahip işletmeler için geliştirilmiş, B2B/SaaS mimarisine uygun modern bir stok ve mağaza yönetim sistemidir. 

Farklı mağazaların (şubelerin) tek bir sistem üzerinden tamamen izole bir şekilde yönetilmesine olanak tanır. Kullanıcı yetkilendirmesi, stok giriş/çıkış operasyonları, dinamik sepet yönetimi ve PDF tabanlı faturalandırma gibi süreçleri uçtan uca dijitalleştirir.

## ✨ Temel Özellikler (Key Features)

- **🏢 Çoklu Şube (Multi-tenant) Mimarisi:** Merkez ve şubelerin (Örn: Beşiktaş Şube, Kadıköy Şube) verileri birbirinden tamamen izole edilir. Yöneticiler sadece kendi şubelerini yönetir; Süper Admin tüm sisteme hakimdir.
- **🔐 Güvenlik & Yetkilendirme:** JWT (JSON Web Token) tabanlı Role-Based Access Control (RBAC). BCrypt ile şifreleme.
- **📦 Gelişmiş Stok Yönetimi:** Ürün giriş ve çıkış logları, kritik stok seviyesi takibi.
- **🛒 Sepet ve Sipariş Modülü:** Hızlı satış ekranı (POS mantığı), anlık toplam hesaplama.
- **📄 Dinamik PDF Fatura:** Satış tamamlandığında `QuestPDF` altyapısı ile milisaniyeler içinde siparişe özel PDF fatura oluşturma.
- **🎨 Modern Arayüz (UI/UX):** React ve Vite ile geliştirilmiş; sade, açık renkli (clean flat/neumorphic) ve kullanıcı dostu arayüz.

## 🛠️ Teknoloji Yığını (Tech Stack)

### Backend
- **Framework:** .NET 9.0 (ASP.NET Core Web API)
- **ORM:** Entity Framework Core 9 (Code-First)
- **Veritabanı:** Microsoft SQL Server 2022
- **Araçlar:** QuestPDF (Fatura), BCrypt.Net (Kriptografi), JWT Bearer

### Frontend
- **Framework:** React 18 (Vite.js)
- **Yönlendirme:** React Router DOM v7
- **HTTP İstemcisi:** Axios
- **Durum Yönetimi:** Context API

### DevOps
- **Konteynerizasyon:** Docker & Docker Compose
- **Web Sunucu:** NGINX (Frontend için)

---

## 🚀 Kurulum ve Çalıştırma (Getting Started)

Projeyi yerel ortamınızda çalıştırmanın en kolay yolu **Docker** kullanmaktır.

### Ön Koşullar
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Node.js 18+ (Sadece lokal geliştirme için)
- .NET 9 SDK (Sadece lokal geliştirme için)

### Docker ile Tek Tıkla Kurulum
Veritabanı, Backend ve Frontend'i aynı anda ayağa kaldırmak için ana dizinde şu komutu çalıştırın:

```bash
docker-compose up -d --build
```
* **Frontend (Arayüz):** `http://localhost:3000`
* **Backend (API):** `http://localhost:5228/swagger`

### Manuel Kurulum (Geliştirici Ortamı)

**1. Veritabanı ve API (Backend)**
```bash
cd MarketApp.API
# Veritabanını oluşturur ve örnek verileri (seed) yükler
dotnet run
```
*(Uygulama başlatıldığında `DbSeeder.cs` otomatik olarak test şubelerini ve admin hesaplarını oluşturacaktır.)*

**2. React Arayüzü (Frontend)**
```bash
cd market-ui
npm install
npm run dev
```

## 🔑 Test Hesapları

Sistem ayağa kalktığında otomatik olarak aşağıdaki test hesapları oluşturulur (Tüm şifreler: `123` veya belirtilen gibidir):

| Kullanıcı Adı | Şifre | Rol | Yetki Alanı |
|---|---|---|---|
| `super@market.com` | `super123` | Super Admin | Tüm sistem |
| `hasan@market.com` | `123` | Admin | Sadece "Merkez Şube" |
| `besiktas@market.com` | `123` | Admin | Sadece "Beşiktaş Şube" |

## 📐 Mimari Tasarım
Proje, katmanlı bir `Controller-Service-Repository` yaklaşımına yakın, ancak mikro geliştirmeler için optimize edilmiş bir yapıdadır. `BaseApiController` üzerinden yetki kontrolleri sağlanır ve JWT içerisindeki `storeId` (Claim) okunarak tüm sorgular şube bazlı filtrelenir.

## 👨‍💻 Geliştirici
**Hasan Basri Dede**  
Full-Stack Software Developer