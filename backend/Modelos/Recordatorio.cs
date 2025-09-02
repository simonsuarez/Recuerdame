namespace backend.Modelos;

public class Recordatorio
{
    public int Id { get; set; }
    public string Titulo { get; set; } = default!;
    public string? Descripcion { get; set; }
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    public bool Completado { get; set; } = false;
}