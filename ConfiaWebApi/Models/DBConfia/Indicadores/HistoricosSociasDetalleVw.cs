using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Indicadores
{
    [TableName("Indicadores.Historicos_Socias_Detalle_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Historicos_Socias_Detalle_VW
    {
              
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("SucursalNombre")]
        public string SucursalNombre { get; set; }
      
        
        [Column("ZonaID")]
        public int? ZonaID { get; set; }
      
        
        [Column("ZonaNombre")]
        public string ZonaNombre { get; set; }
      
        
        [Column("DistAntSistema")]
        public string DistAntSistema { get; set; }
      
        
        [Column("DistAntNumero")]
        public int? DistAntNumero { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("GrupoID")]
        public int? GrupoID { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        
        [Column("FechaUltimoVencimiento")]
        public DateTime? FechaUltimoVencimiento { get; set; }
      
        
        [Column("FechaUltimoLiquidacion")]
        public DateTime? FechaUltimoLiquidacion { get; set; }
      
        
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
      
        
        [Column("DiasAtrasoCierre")]
        public int? DiasAtrasoCierre { get; set; }
      
        
        [Column("IncrementoSugerido")]
        public decimal? IncrementoSugerido { get; set; }
      
        
        [Column("IncrementoMes")]
        public bool? IncrementoMes { get; set; }
      
        
        [Column("IncrementoAutorizado")]
        public decimal? IncrementoAutorizado { get; set; }
      
        
        [Column("EstadoCoordinadorId")]
        public string EstadoCoordinadorId { get; set; }
      
        
        [Column("CoordinadorID")]
        public Int64? CoordinadorID { get; set; }
      
        
        [Column("CoordinadorNombre")]
        public string CoordinadorNombre { get; set; }
      
        
        [Column("DistribuidorNombre")]
        public string DistribuidorNombre { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("ProductoNombre")]
        public string ProductoNombre { get; set; }
      
        
        [Column("EmpresaId")]
        public int? EmpresaId { get; set; }
      
        
        [Column("EmpresaNombre")]
        public string EmpresaNombre { get; set; }
      
        
        [Column("Limite")]
        public decimal? Limite { get; set; }
      
        
        [Column("Saldo")]
        public decimal? Saldo { get; set; }
      
        
        [Column("Vencido")]
        public decimal? Vencido { get; set; }
      
        
        [Column("Cobranza")]
        public decimal? Cobranza { get; set; }
      
        
        [Column("Comision")]
        public decimal? Comision { get; set; }
      
        
        [Column("Pendiente")]
        public decimal? Pendiente { get; set; }
      
        
        [Column("Reestructura")]
        public decimal? Reestructura { get; set; }
      
        
        [Column("Convenio")]
        public decimal? Convenio { get; set; }
      
        
        [Column("Colocacion")]
        public decimal? Colocacion { get; set; }
      
        
        [Column("Disponible")]
        public decimal? Disponible { get; set; }


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
