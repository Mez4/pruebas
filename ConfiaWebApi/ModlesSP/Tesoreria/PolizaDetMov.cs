using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class PolizaDetMov
    {

        [Column("MovimientoPolizaID")]
        public int MovimientoPolizaID { get; set; }

        [Column("Descripcion")]
        public string Descripcion { get; set; }

        [Column("Cuenta")]
        public string Cuenta { get; set; }

        [Column("Nombre")]
        public string Nombre { get; set; }

        [Column("Referencia")]
        public string Referencia { get; set; }

        [Column("Debe")]
        public decimal Debe { get; set; }

        [Column("Haber")]
        public decimal Haber { get; set; }
























    }
}
