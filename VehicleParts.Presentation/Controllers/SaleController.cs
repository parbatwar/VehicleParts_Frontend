using Microsoft.AspNetCore.Mvc;
using VehicleParts.Application.DTOs.Sale;
using VehicleParts.Application.Interfaces.Services;

namespace VehicleParts.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SaleController : ControllerBase
{
    private readonly ISaleService _saleService;

    public SaleController(ISaleService saleService)
    {
        _saleService = saleService;
    }

    
    /// Feature 7: Staff creates a sale and gets an invoice back
    /// Feature 16: 10% discount automatically applied if subtotal > 5000
    
    [HttpPost]
    public async Task<IActionResult> CreateSale([FromBody] CreateSaleDto createSaleDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var result = await _saleService.ProcessSaleAsync(createSaleDto);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while processing the sale.", detail = ex.Message });
        }
    }

    /// <summary>
    /// Feature 7: Get a specific sale/invoice by ID
    /// GET /api/sale/{id}
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSaleById(int id)
    {
        var sale = await _saleService.GetSaleByIdAsync(id);
        if (sale == null)
            return NotFound(new { message = $"Sale with ID {id} not found." });

        return Ok(sale);
    }

    /// <summary>
    /// Feature 7: Get all sales for a specific customer
    /// GET /api/sale/customer/{customerId}
    /// </summary>
    [HttpGet("customer/{customerId}")]
    public async Task<IActionResult> GetSalesByCustomer(int customerId)
    {
        var sales = await _saleService.GetSalesByCustomerAsync(customerId);
        return Ok(sales);
    }
}
