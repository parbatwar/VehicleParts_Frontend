namespace VehicleParts.Application.DTOs.Sale;

public class SaleResponseDto
{
    public int SaleId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public List<SaleItemResponseDto> Items { get; set; } = new();
    public decimal SubTotal { get; set; }
    public bool LoyaltyDiscountApplied { get; set; }  // Feature 16
    public decimal DiscountAmount { get; set; }        // Feature 16
    public decimal FinalAmount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public DateTime SaleDate { get; set; }
}

public class SaleItemResponseDto
{
    public string PartName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Total { get; set; }
}
