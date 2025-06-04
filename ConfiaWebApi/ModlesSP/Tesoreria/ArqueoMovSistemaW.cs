using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class ArqueoMovSistemaW
    {
        [Column("CajaID")]
        public int CajaID { get; set; }

        [Column("MovimientoID")]
        public int MovimientoID { get; set; }

        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }

        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        [Column("Producto")]
        public string Producto { get; set; }


        [Column("CveMovimientoID")]
        public string CveMovimientoID { get; set; }

        [Column("DescMovimiento")]
        public string DescMovimiento { get; set; }

        [Column("Total")]
        public string Total { get; set; }
    }

    public class ArqueoMovSistemaBovedasW
    {


        [Column("MovimientoID")]
        public int MovimientoID { get; set; }

        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }

        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        [Column("Producto")]
        public string Producto { get; set; }


        [Column("CveMovimientoID")]
        public string CveMovimientoID { get; set; }

        [Column("DescMovimiento")]
        public string DescMovimiento { get; set; }

        [Column("Total")]
        public decimal Total { get; set; }
    }
}
