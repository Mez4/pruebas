using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.Indicadores
{
    [ExplicitColumns]
    public class IndicadorCobranza
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

        [Column("DistribuidorEstatus")]
        public string DistribuidorEstatus { get; set; }

        [Column("DistribuidorVR")]
        public string DistribuidorVR { get; set; }

        [Column("TipoPago")]
        public string TipoPago { get; set; }

        [Column("Vencido")]
        public decimal Vencido { get; set; }

        [Column("CobranzaPA")]
        public decimal CobranzaPA { get; set; }

        [Column("CobranzaPP")]
        public decimal CobranzaPP { get; set; }

        [Column("CobranzaPI")]
        public decimal CobranzaPI { get; set; }

        [Column("CobranzaPT")]
        public decimal CobranzaPT { get; set; }

        [Column("CobranzaSP")]
        public decimal CobranzaSP { get; set; }

        [Column("CobranzaFinal")]
        public decimal CobranzaFinal { get; set; }

        [Column("Pendiente")]
        public decimal Pendiente { get; set; }

        [Column("Saldo")]
        public decimal Saldo { get; set; }

        [Column("DiasAtraso")]
        public int DiasAtraso { get; set; }

        [Column("Porc_CobranzaPA")]
        public decimal Porc_CobranzaPA { get; set; }

        [Column("Porc_CobranzaPP")]
        public decimal Porc_CobranzaPP { get; set; }

        [Column("Porc_CobranzaPI")]
        public decimal Porc_CobranzaPI { get; set; }

        [Column("Porc_CobranzaPT")]
        public decimal Porc_CobranzaPT { get; set; }

        [Column("Porc_CobranzaSP")]
        public decimal Porc_CobranzaSP { get; set; }

        [Column("Porc_CobranzaFinal")]
        public decimal Porc_CobranzaFinal { get; set; }

        [Column("Porc_Pendiente")]
        public decimal Porc_Pendiente { get; set; }

        [Column("Porc_Peso")]
        public decimal Porc_Peso { get; set; }

        [Column("Peso_CobranzaPA")]
        public decimal Peso_CobranzaPA { get; set; }

        [Column("Peso_CobranzaPP")]
        public decimal Peso_CobranzaPP { get; set; }

        [Column("Peso_CobranzaPI")]
        public decimal Peso_CobranzaPI { get; set; }

        [Column("Peso_CobranzaPT")]
        public decimal Peso_CobranzaPT { get; set; }

        [Column("Peso_CobranzaSP")]
        public decimal Peso_CobranzaSP { get; set; }

        [Column("Peso_CobranzaFinal")]
        public decimal Peso_CobranzaFinal { get; set; }

        [Column("Peso_Pendiente")]
        public decimal Peso_Pendiente { get; set; }

        [Column("Dvs_Vencido")]
        public decimal Dvs_Vencido { get; set; }

        [Column("Dvs_CobranzaPA")]
        public decimal Dvs_CobranzaPA { get; set; }

        [Column("Dvs_CobranzaPP")]
        public decimal Dvs_CobranzaPP { get; set; }

        [Column("Dvs_CobranzaPI")]
        public decimal Dvs_CobranzaPI { get; set; }

        [Column("Dvs_CobranzaPT")]
        public decimal Dvs_CobranzaPT { get; set; }

        [Column("Dvs_CobranzaSP")]
        public decimal Dvs_CobranzaSP { get; set; }

        [Column("Dvs_CobranzaFinal")]
        public decimal Dvs_CobranzaFinal { get; set; }

        [Column("Dvs_Pendiente")]
        public int Dvs_Pendiente { get; set; }
    }
}
