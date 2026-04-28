using VehicleParts.Application.DTOs.Sale;

namespace VehicleParts.Application.Interfaces.Services;

public interface ISaleService
{
    Task<SaleResponseDto> ProcessSaleAsync(CreateSaleDto createSaleDto);
    Task<SaleResponseDto?> GetSaleByIdAsync(int saleId);
    Task<List<SaleResponseDto>> GetSalesByCustomerAsync(int customerId);
}
