namespace VehicleParts.Infrastructure.Services;


/// Feature 16: Loyalty Program
/// Customers get 10% discount if they spend more than 5000 in a single purchase

public class LoyaltyService
{
    private const decimal LoyaltyThreshold = 5000m;
    private const decimal DiscountRate = 0.10m;
    
    /// Checks if the subtotal qualifies for loyalty discount
    public bool IsEligibleForDiscount(decimal subTotal)
    {
        return subTotal > LoyaltyThreshold;
    }
    
    /// Calculates the discount amount
    /// Returns 0 if not eligible
    public decimal CalculateDiscount(decimal subTotal)
    {
        if (!IsEligibleForDiscount(subTotal))
            return 0m;

        return Math.Round(subTotal * DiscountRate, 2);
    }
    
    /// Returns the final amount after applying discount
    public decimal ApplyDiscount(decimal subTotal)
    {
        return subTotal - CalculateDiscount(subTotal);
    }
}
