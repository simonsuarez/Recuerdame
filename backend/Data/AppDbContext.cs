using Microsoft.EntityFrameworkCore;
using backend.Modelos;

namespace backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Recordatorio> Recordatorios => Set<Recordatorio>();
}