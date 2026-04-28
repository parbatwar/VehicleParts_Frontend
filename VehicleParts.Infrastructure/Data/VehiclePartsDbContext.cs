using Microsoft.EntityFrameworkCore;
using VehicleParts.Infrastructure.Models;

namespace VehicleParts.Infrastructure.Data;

public class VehiclePartsDbContext : DbContext
{
    public VehiclePartsDbContext(DbContextOptions<VehiclePartsDbContext> options)
        : base(options) { }

    public DbSet<Sale> Sales { get; set; }
    public DbSet<SaleItem> SaleItems { get; set; }
}