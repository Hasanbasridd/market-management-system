using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MarketApp.API.Data;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace MarketApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InvoiceController : BaseApiController
{
    private readonly AppDbContext _db;

    public InvoiceController(AppDbContext db)
    {
        _db = db;
        // QuestPDF Community License (Free for small businesses)
        QuestPDF.Settings.License = LicenseType.Community;
    }

    [HttpGet("{orderId}/pdf")]
    public async Task<IActionResult> GenerateInvoicePdf(int orderId)
    {
        var storeId = GetStoreId();
        
        var query = _db.Orders
            .Include(o => o.Items)
            .Include(o => o.Store)
            .Include(o => o.User)
            .Where(o => o.Id == orderId);
            
        if (storeId.HasValue)
            query = query.Where(o => o.StoreId == storeId.Value);

        var order = await query.FirstOrDefaultAsync();

        if (order == null)
            return NotFound("Sipariş bulunamadı veya bu şubeye ait değil.");

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(12).FontFamily("Arial"));

                page.Header().Element(header => ComposeHeader(header, order));
                page.Content().Element(content => ComposeContent(content, order));
                page.Footer().Element(footer => ComposeFooter(footer));
            });
        });

        var pdfBytes = document.GeneratePdf();
        return File(pdfBytes, "application/pdf", $"Fatura_{order.Id}.pdf");
    }

    private void ComposeHeader(IContainer container, Models.Order order)
    {
        var titleStyle = TextStyle.Default.FontSize(20).SemiBold().FontColor(Colors.Blue.Darken2);

        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text($"Fatura #{order.Id}").Style(titleStyle);
                column.Item().Text(text =>
                {
                    text.Span("Tarih: ").SemiBold();
                    text.Span($"{order.CreatedAt:dd.MM.yyyy HH:mm}");
                });
            });

            row.ConstantItem(150).Column(column =>
            {
                column.Item().Text(order.Store.Name).SemiBold();
                column.Item().Text(order.Store.Address ?? "Adres Yok");
                column.Item().Text(order.Store.Phone ?? "Telefon Yok");
            });
        });
    }

    private void ComposeContent(IContainer container, Models.Order order)
    {
        container.PaddingVertical(1, Unit.Centimetre).Column(column =>
        {
            column.Spacing(10);
            
            column.Item().Text("Müşteri Bilgileri").SemiBold();
            column.Item().Text(order.User.Name);
            column.Item().Text(order.User.Email);

            column.Item().PaddingTop(15).Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.ConstantColumn(40);
                    columns.RelativeColumn();
                    columns.ConstantColumn(80);
                    columns.ConstantColumn(80);
                    columns.ConstantColumn(100);
                });

                table.Header(header =>
                {
                    header.Cell().Text("#").SemiBold();
                    header.Cell().Text("Ürün").SemiBold();
                    header.Cell().AlignRight().Text("Birim Fiyat").SemiBold();
                    header.Cell().AlignRight().Text("Miktar").SemiBold();
                    header.Cell().AlignRight().Text("Toplam").SemiBold();
                    
                    header.Cell().ColumnSpan(5).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Grey.Lighten2);
                });

                int index = 1;
                foreach (var item in order.Items)
                {
                    table.Cell().Element(CellStyle).Text(index.ToString());
                    table.Cell().Element(CellStyle).Text(item.ProductName);
                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.UnitPrice:N2} TL");
                    table.Cell().Element(CellStyle).AlignRight().Text(item.Quantity.ToString());
                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.UnitPrice * item.Quantity:N2} TL");

                    index++;

                    static IContainer CellStyle(IContainer container)
                    {
                        return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                    }
                }
            });

            column.Item().PaddingTop(15).AlignRight().Text(text =>
            {
                text.Span("Genel Toplam: ").SemiBold().FontSize(14);
                text.Span($"{order.TotalAmount:N2} TL").SemiBold().FontSize(14).FontColor(Colors.Green.Darken2);
            });
        });
    }

    private void ComposeFooter(IContainer container)
    {
        container.AlignCenter().Text(x =>
        {
            x.Span("Sayfa ");
            x.CurrentPageNumber();
            x.Span(" / ");
            x.TotalPages();
        });
    }
}
