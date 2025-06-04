using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Cobranza
{
    [ExplicitColumns]
    public class spAltaGestor
    {
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }


        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }


        [Column("MesaCobranzaID")]
        public int MesaCobranzaID { get; set; }


        [Column("mesaCobranza")]
        public string mesaCobranza { get; set; }


        [Column("Activo")]
        public bool Activo { get; set; }


        [Column("regresa")]
        public int regresa { get; set; }


        [Column("msj")]
        public string msj { get; set; }
    }
}
