using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class DetallePolizas
    {


        [Column("PolizaID")]
        public int PolizaID { get; set; }

        [Column("Referencia")]
        public string Referencia { get; set; }

        [Column("Numero")]
        public int Numero { get; set; }

        [Column("Fecha")]
        public DateTime Fecha { get; set; }

        [Column("TipoPolizaID")]
        public int TipoPolizaID { get; set; }

        [Column("TipoPolizaDesc")]
        public string TipoPolizaDesc { get; set; }

        [Column("Estatus")]
        public string Estatus { get; set; }

        [Column("CatEstatusMovID")]
        public int CatEstatusMovID { get; set; }

        [Column("MovimientoPolizaID")]
        public int MovimientoPolizaID { get; set; }

        [Column("DescMovimientoPoliza")]
        public string DescMovimientoPoliza { get; set; }

        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }

        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        [Column("DescripcionCuenta")]
        public string DescripcionCuenta { get; set; }

        [Column("RefMovPoliza")]
        public string RefMovPoliza { get; set; }

        [Column("Debe")]
        public decimal Debe { get; set; }

        [Column("Haber")]
        public decimal Haber { get; set; }
    }
}
