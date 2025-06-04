using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class ModeloBovedas
    {


        [Column("SucursalID")]
        public int? SucursalID { get; set; }

        [Column("NombreSucursal")]

        public string NombreSucursal { get; set; }


        [Column("BovedaID")]
        public int? BovedaID { get; set; }

        [Column("NombreBoveda")]
        public string NombreBoveda { get; set; }

        [Column("SaldoBoveda")]
        public decimal? SaldoBoveda { get; set; }

        [Column("CuentaBancoID")]
        public int? CuentaBancoID { get; set; }

        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        [Column("NumeroCajas")]
        public int NumeroCajas { get; set; }

        [Column("ProductoCuentaID")]
        public int? ProductoCuentaID { get; set; }

        [Column("Activa")]
        public bool? Activa { get; set; }


        [Column("ProductoCuenta")]
        public string ProductoCuenta { get; set; }

        [Column("SaldoTotalCajas")]
        public decimal? SaldoTotalCajas { get; set; }

        [Column("Cajas")]
        public List<DBContext.DBConfia.Custom.Tesoreria.ModeloCajas> Cajas { get; set; }

    }
}
