using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class ModeloCajas
    {

        [Column("Estatus")]
        public bool Estatus { get; set; }

        [Column("SucursalID")]
        public int? SucursalID { get; set; }

        [Column("NombreSucursal")]

        public string NombreSucursal { get; set; }


        [Column("CajaID")]
        public int? CajaID { get; set; }

        [Column("Nombre")]
        public string Nombre { get; set; }

        [Column("EnOperacion")]
        public int? EnOperacion { get; set; }

        [Column("BovedaID")]
        public int? BovedaID { get; set; }

        [Column("NombreBoveda")]
        public string NombreBoveda { get; set; }


        [Column("TotalCaja")]
        public decimal? TotalCaja { get; set; }

        [Column("DetalleProductos")]
        public List<DBContext.DBConfia.Tesoreria.SaldosCajaPorProducto_VW> DetalleProductos { get; set; }

    }
}
