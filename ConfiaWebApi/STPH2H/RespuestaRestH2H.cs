
using System.Collections.Generic;

public class Resultado
{
    public string descripcionError { get; set; }
    public int id { get; set; }
}

public class Respuesta
{
    public Resultado resultado { get; set; }
}
