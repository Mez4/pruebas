using NPoco;
using System;
namespace ConfiaWebApi.ModlesSP.General
{
    [ExplicitColumns]
    public class ActualizarGeneral
    {
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }

        [Column("Field")]
        public string Field { get; set; }

        [Column("regresa")]

        public int regresa { get; set; }

        [Column("mensaje")]
        public string mensaje { get; set; }
    }
}
