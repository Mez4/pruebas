using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Cobranza
{
    [ExplicitColumns]
    public class spCancelarTicket
    {
        [Column("TicketID")]
        public int TicketID { get; set; }


        [Column("Usuario_Logueado")]
        public int? Usuario_Logueado { get; set; }


        [Column("persona_Logueada")]
        public int? persona_Logueada { get; set; }


        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }


        [Column("Monto")]
        public decimal? Monto { get; set; }


        [Column("Ruta")]
        public string Ruta { get; set; }


        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }


        [Column("Activo")]
        public bool? Activo { get; set; }


        [Column("regresa")]
        public int regresa { get; set; }


        [Column("msj")]
        public string msj { get; set; }

    }
}
