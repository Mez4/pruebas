using NPoco;
using System;

namespace ConfiaWebApi.ModlesSP.General
{
    [ExplicitColumns]
    public class FechaCorteActual
    {
        [Column("regresa")]

        public int regresa { get; set; }

        [Column("mensaje")]
        public string mensaje { get; set; }

        [Column("fecha")]
        public DateTime fecha { get; set; }
    }
}
