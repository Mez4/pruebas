using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.Indicadores
{
    [ExplicitColumns]
    public class IndicadorCartera
    {
        [Column("Fecha")]
        public DateTime Fecha { get; set; }

        [Column("SucursalId")]
        public int SucursalId { get; set; }

        [Column("Sucursal")]
        public string Sucursal { get; set; }

        [Column("GrupoID")]
        public int GrupoID { get; set; }

        [Column("CoordinadorID")]
        public int CoordinadorID { get; set; }

        [Column("Coordinador")]
        public string Coordinador { get; set; }

        [Column("ProductoID")]
        public int ProductoID { get; set; }

        [Column("Producto")]
        public string Producto { get; set; }

        [Column("TipoCartera")]
        public string TipoCartera { get; set; }

        [Column("Cartera")]
        public decimal Cartera { get; set; }

        [Column("Calidad")]
        public decimal Calidad { get; set; }

        [Column("Dvs_Cartera")]
        public int Dvs_Cartera { get; set; }
    }
}
