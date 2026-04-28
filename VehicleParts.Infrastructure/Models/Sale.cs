namespace VehicleParts.Infrastructure.Models;

public class Sale
{
    public int SaleId { get; set; }
    public int CustomerId { get; set; }
    public int StaffId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public decimal SubTotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal FinalAmount { get; set; }
    public bool LoyaltyDiscountApplied { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public DateTime SaleDate { get; set; }
    public List<SaleItem> Items { get; set; } = new();
}