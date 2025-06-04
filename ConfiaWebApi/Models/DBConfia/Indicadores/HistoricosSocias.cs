using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Indicadores
{
    [TableName("Indicadores.Historicos_Socias")]
    [ExplicitColumns]
    [PrimaryKey("DistribuidorID,Fecha,SucursalID", AutoIncrement=false)]
    public class Historicos_Socias
    {
              
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("FechaCorte")]
        public DateTime? FechaCorte { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int? DistribuidorNivelID { get; set; }
      
        
        [Column("GrupoID")]
        public int? GrupoID { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        
        [Column("DiasAtrasoCierre")]
        public int? DiasAtrasoCierre { get; set; }
      
        
        [Column("FechaUltimoVencimiento")]
        public DateTime? FechaUltimoVencimiento { get; set; }
      
        
        [Column("FechaUltimoLiquidacion")]
        public DateTime? FechaUltimoLiquidacion { get; set; }
      
        
        [Column("FechaAntLiquidacion")]
        public DateTime? FechaAntLiquidacion { get; set; }
      
        
        [Column("TipoPago")]
        public string TipoPago { get; set; }
      
        
        [Column("TipoPagoAnt1")]
        public string TipoPagoAnt1 { get; set; }
      
        
        [Column("TipoPagoAnt2")]
        public string TipoPagoAnt2 { get; set; }
      
        
        [Column("TipoPagoAnt3")]
        public string TipoPagoAnt3 { get; set; }
      
        
        [Column("TipoPagoAnt4")]
        public string TipoPagoAnt4 { get; set; }
      
        
        [Column("IncrementoMes")]
        public bool? IncrementoMes { get; set; }
      
        
        [Column("IncrementoSugerido")]
        public decimal? IncrementoSugerido { get; set; }
      
        
        [Column("IncrementoAutorizado")]
        public decimal? IncrementoAutorizado { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}
