using VehicleParts.Application.DTOs.Sale;

namespace VehicleParts.Application.Interfaces.IRepositories;

public interface ISaleRepository
{
    Task<SaleResponseDto> CreateSaleAsync(CreateSaleDto createSaleDto);
    Task<SaleResponseDto?> GetSaleByIdAsync(int saleId);
    Task<List<SaleResponseDto>> GetSalesByCustomerAsync(int customerId);
}
