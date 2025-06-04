using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Cobranza
{
    [ExplicitColumns]
    public class spActualizarMesaCobranza
    {
        [Column("MesaCobranzaID")]
        public int MesaCobranzaID { get; set; }

        [Column("Nombre")]
        public string Nombre { get; set; }

        [Column("Clave")]
        public string Clave { get; set; }

        [Column("Activo")]
        public bool Activo { get; set; }
        public int UsuarioID { get; set; }
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }
    }
}
