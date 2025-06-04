using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cortes
{
    [TableName("Cortes.RelacionCortesHistorico_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class RelacionCortesHistorico_VW
    {
              
        
        [Column("fechaCorte")]
        public string fechaCorte { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int? DistribuidorNivelID { get; set; }
      
        
        [Column("DistribuidorNivelIDOrigen")]
        public int? DistribuidorNivelIDOrigen { get; set; }
      
        
        [Column("creditosEnRelacion")]
        public int? creditosEnRelacion { get; set; }
      
        
        [Column("LineaCredito")]
        public decimal? LineaCredito { get; set; }
      
        
        [Column("LineaCreditoDisponible")]
        public decimal? LineaCreditoDisponible { get; set; }
      
        
        [Column("FechaVencimiento")]
        public DateTime? FechaVencimiento { get; set; }
      
        
        [Column("saldoVencidoTotal")]
        public decimal? saldoVencidoTotal { get; set; }
      
        
        [Column("saldoAtrasado")]
        public decimal? saldoAtrasado { get; set; }
      
        
        [Column("importePlazo")]
        public decimal? importePlazo { get; set; }
      
        
        [Column("saldoPlazo")]
        public decimal? saldoPlazo { get; set; }
      
        
        [Column("CapitalPlazo")]
        public decimal? CapitalPlazo { get; set; }
      
        
        [Column("InteresPlazo")]
        public decimal? InteresPlazo { get; set; }
      
        
        [Column("ManejoCuentaPlazo")]
        public decimal? ManejoCuentaPlazo { get; set; }
      
        
        [Column("SeguroPlazo")]
        public decimal? SeguroPlazo { get; set; }
      
        
        [Column("ComisionPlazo")]
        public decimal? ComisionPlazo { get; set; }
      
        
        [Column("CargoPlazo")]
        public decimal? CargoPlazo { get; set; }
      
        
        [Column("IvaPlazo")]
        public decimal? IvaPlazo { get; set; }
      
        
        [Column("AbonosPlazo")]
        public decimal? AbonosPlazo { get; set; }
      
        
        [Column("baseComision")]
        public decimal? baseComision { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("DistribuidorNivel")]
        public string DistribuidorNivel { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("ConvenioID")]
        public int ConvenioID { get; set; }
      
        
        [Column("convenio")]
        public string convenio { get; set; }
      
        
        [Column("refSoriana")]
        public string refSoriana { get; set; }
      
        
        [Column("refBancomer")]
        public string refBancomer { get; set; }
      
        
        [Column("ContratoCIE")]
        public string ContratoCIE { get; set; }
      
        
        [Column("refOxxo")]
        public string refOxxo { get; set; }
      
        
        [Column("refSPEI")]
        public string refSPEI { get; set; }
      
        
        [Column("DistribuidorNivelID2")]
        public int? DistribuidorNivelID2 { get; set; }
      
        
        [Column("DistAntNumero2")]
        public int? DistAntNumero2 { get; set; }
      
        
        [Column("DistAntNumero")]
        public int? DistAntNumero { get; set; }


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
