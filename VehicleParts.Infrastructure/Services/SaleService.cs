using VehicleParts.Application.DTOs.Sale;
using VehicleParts.Application.Interfaces.IRepositories;
using VehicleParts.Application.Interfaces.Services;

namespace VehicleParts.Infrastructure.Services;

/// Feature 7: Staff can sell vehicle parts and create sales invoices
/// Feature 16: Loyalty Program - 10% discount if purchase exceeds 5000
public class SaleService : ISaleService
{
    private readonly ISaleRepository _saleRepository;
    private readonly LoyaltyService _loyaltyService;

    public SaleService(ISaleRepository saleRepository, LoyaltyService loyaltyService)
    {
        _saleRepository = saleRepository;
        _loyaltyService = loyaltyService;
    }
    
    /// Feature 7: Processes a sale and creates an invoice
    /// Feature 16: Automatically applies 10% loyalty discount if subtotal > 5000
    public async Task<SaleResponseDto> ProcessSaleAsync(CreateSaleDto createSaleDto)
    {
        // Validate request
        if (createSaleDto.Items == null || !createSaleDto.Items.Any())
            throw new ArgumentException("Sale must contain at least one item.");

        // Calculate subtotal
        decimal subTotal = createSaleDto.Items
            .Sum(item => item.Quantity * item.UnitPrice);

        // Feature 16: Check and apply loyalty discount
        bool discountApplied = _loyaltyService.IsEligibleForDiscount(subTotal);
        decimal discountAmount = _loyaltyService.CalculateDiscount(subTotal);
        decimal finalAmount = _loyaltyService.ApplyDiscount(subTotal);

        // Create sale in repository (DB)
        var saleResponse = await _saleRepository.CreateSaleAsync(createSaleDto);

        // Attach financial details to response
        saleResponse.SubTotal = subTotal;
        saleResponse.LoyaltyDiscountApplied = discountApplied;   // Feature 16
        saleResponse.DiscountAmount = discountAmount;              // Feature 16
        saleResponse.FinalAmount = finalAmount;

        // Build line items for invoice
        saleResponse.Items = createSaleDto.Items.Select(item => new SaleItemResponseDto
        {
            PartName = $"Part #{item.PartId}", // TODO: Fetch real part name from DB
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            Total = item.Quantity * item.UnitPrice
        }).ToList();

        return saleResponse;
    }

    public async Task<SaleResponseDto?> GetSaleByIdAsync(int saleId)
    {
        return await _saleRepository.GetSaleByIdAsync(saleId);
    }

    public async Task<List<SaleResponseDto>> GetSalesByCustomerAsync(int customerId)
    {
        return await _saleRepository.GetSalesByCustomerAsync(customerId);
    }
}
