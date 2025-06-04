using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.Indicadores
{
    [ExplicitColumns]
    public class IndicadorColocacionImproductivas
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

        [Column("DistribuidorID")]
        public int DistribuidorID { get; set; }

        [Column("Distribuidor")]
        public string Distribuidor { get; set; }

        [Column("DistribuidorVR")]
        public string DistribuidorVR { get; set; }

        [Column("TipoPago")]
        public string TipoPago { get; set; }

        [Column("Limite")]
        public decimal Limite { get; set; }

        [Column("Disponible")]
        public decimal Disponible { get; set; }

        [Column("Porc_Disponible")]
        public decimal Porc_Disponible { get; set; }

        [Column("Colocacion")]
        public decimal Colocacion { get; set; }

        [Column("Bono")]
        public decimal Bono { get; set; }

        [Column("ColocacionAnterior")]
        public decimal ColocacionAnterior { get; set; }

    }
}
