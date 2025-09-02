using backend.Data;
using backend.Modelos;
using Microsoft.EntityFrameworkCore;
using Npgsql; // si luego pruebas Npgsql puro

var builder = WebApplication.CreateBuilder(args);

// DbContext con tu cadena (ya la pusiste en appsettings.json)
builder.Services.AddDbContext<AppDbContext>(
    opt => opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors();

// endpoint de sanity
app.MapGet("/", () => "API Recuerdame OK");

// CRUD mínimo
app.MapGet("/api/recordatorios", async (AppDbContext db) =>
    await db.Recordatorios.OrderByDescending(r => r.Id).ToListAsync());

app.MapGet("/api/recordatorios/{id:int}", async (int id, AppDbContext db) =>
    await db.Recordatorios.FindAsync(id) is { } r ? Results.Ok(r) : Results.NotFound());

app.MapPost("/api/recordatorios", async (Recordatorio r, AppDbContext db) =>
{
    db.Recordatorios.Add(r);
    await db.SaveChangesAsync();
    return Results.Created($"/api/recordatorios/{r.Id}", r);
});

app.MapPut("/api/recordatorios/{id:int}", async (int id, Recordatorio input, AppDbContext db) =>
{
    var r = await db.Recordatorios.FindAsync(id);
    if (r is null) return Results.NotFound();
    r.Titulo = input.Titulo;
    r.Descripcion = input.Descripcion;
    r.Fecha = input.Fecha;
    r.Completado = input.Completado;
    await db.SaveChangesAsync();
    return Results.Ok(r);
});

app.MapDelete("/api/recordatorios/{id:int}", async (int id, AppDbContext db) =>
{
    var r = await db.Recordatorios.FindAsync(id);
    if (r is null) return Results.NotFound();
    db.Recordatorios.Remove(r);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();