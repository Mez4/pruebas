using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class FnsPolizasConciliacion
    {

        [Column("MovimientoID")]
        public int MovimientoID { get; set; }


        [Column("CuentaOrigenID")]
        public int CuentaOrigenID { get; set; }

        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        [Column("NumeroCuentaDestino")]
        public string NumeroCuentaDestino { get; set; }

        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }

        [Column("Importe")]
        public decimal Importe { get; set; }

        [Column("Observaciones")]
        public string Observaciones { get; set; }

        [Column("TipoMovimientoID")]
        public int TipoMovimientoID { get; set; }

        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }

        [Column("Producto")]
        public string Producto { get; set; }


    }
}
