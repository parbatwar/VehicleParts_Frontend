namespace VehicleParts.Application.DTOs.Sale;

public class CreateSaleDto
{
    public int StaffId { get; set; }
    public int CustomerId { get; set; }
    public List<SaleItemDto> Items { get; set; } = new();
    public string PaymentMethod { get; set; } = string.Empty; // Cash, Credit, Card
}
