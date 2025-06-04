using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Cobranza
{
    [ExplicitColumns]
    public class spAltaPersonaEncargado
    {
        [Column("DirectorMesaCobranzaID")]
        public Int64 DirectorMesaCobranzaID { get; set; }

        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }

        [Column("Activo")]
        public bool Activo { get; set; }

        [Column("regresa")]
        public int regresa { get; set; }


        [Column("msj")]
        public string msj { get; set; }
    }
}
