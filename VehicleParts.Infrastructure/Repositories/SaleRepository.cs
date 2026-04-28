using Microsoft.EntityFrameworkCore;
using VehicleParts.Application.DTOs.Sale;
using VehicleParts.Application.Interfaces.IRepositories;
using VehicleParts.Infrastructure.Data;
using VehicleParts.Infrastructure.Models;

namespace VehicleParts.Infrastructure.Repositories;

public class SaleRepository : ISaleRepository
{
    private readonly VehiclePartsDbContext _context;

    public SaleRepository(VehiclePartsDbContext context)
    {
        _context = context;
    }

    public async Task<SaleResponseDto> CreateSaleAsync(CreateSaleDto dto)
    {
        var sale = new Sale
        {
            CustomerId = dto.CustomerId,
            StaffId = dto.StaffId,
            InvoiceNumber = $"INV-{DateTime.Now:yyyyMMddHHmmss}",
            PaymentMethod = dto.PaymentMethod,
            SaleDate = DateTime.UtcNow,
            Items = dto.Items.Select(i => new SaleItem
            {
                PartId = i.PartId,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                Total = i.Quantity * i.UnitPrice
            }).ToList()
        };

        _context.Sales.Add(sale);
        await _context.SaveChangesAsync();
        return MapToResponse(sale);
    }

    public async Task<SaleResponseDto?> GetSaleByIdAsync(int saleId)
    {
        var sale = await _context.Sales
            .Include(s => s.Items)
            .FirstOrDefaultAsync(s => s.SaleId == saleId);

        return sale == null ? null : MapToResponse(sale);
    }

    public async Task<List<SaleResponseDto>> GetSalesByCustomerAsync(int customerId)
    {
        var sales = await _context.Sales
            .Include(s => s.Items)
            .Where(s => s.CustomerId == customerId)
            .ToListAsync();

        return sales.Select(MapToResponse).ToList();
    }

    private static SaleResponseDto MapToResponse(Sale sale)
    {
        return new SaleResponseDto
        {
            SaleId = sale.SaleId,
            InvoiceNumber = sale.InvoiceNumber,
            CustomerId = sale.CustomerId,
            SubTotal = sale.SubTotal,
            DiscountAmount = sale.DiscountAmount,
            FinalAmount = sale.FinalAmount,
            LoyaltyDiscountApplied = sale.LoyaltyDiscountApplied,
            PaymentMethod = sale.PaymentMethod,
            SaleDate = sale.SaleDate,
            Items = sale.Items.Select(i => new SaleItemResponseDto
            {
                PartName = $"Part #{i.PartId}",
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                Total = i.Total
            }).ToList()
        };
    }
}