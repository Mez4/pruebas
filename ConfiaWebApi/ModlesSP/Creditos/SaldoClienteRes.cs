using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Creditos
{
    [ExplicitColumns]
    public class SaldoClienteRes
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("ClienteID")]
        public string ClienteID { get; set; }

        [Column("MovimientoID")]
        public string MovimientoID { get; set; }

        [Column("MovimientoID_COM")]
        public string MovimientoID_COM { get; set; }

        [Column("sw_continuar")]
        public bool sw_continuar { get; set; } 
        
    }
}
