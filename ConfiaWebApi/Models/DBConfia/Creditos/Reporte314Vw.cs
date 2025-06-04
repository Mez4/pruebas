using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Reporte314_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Reporte314_VW
    {
              
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("PersonaNombre")]
        public string PersonaNombre { get; set; }
      
        
        [Column("fechaCorte")]
        public DateTime fechaCorte { get; set; }
      
        
        [Column("ClienteID")]
        public Int64? ClienteID { get; set; }
      
        
        [Column("movCli")]
        public int? movCli { get; set; }
      
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }
      
        
        [Column("NoPago")]
        public int NoPago { get; set; }
      
        
        [Column("saldoCredito")]
        public decimal? saldoCredito { get; set; }
      
        
        [Column("CapitalPlazo")]
        public decimal? CapitalPlazo { get; set; }
      
        
        [Column("InteresPlazo")]
        public decimal? InteresPlazo { get; set; }
      
        
        [Column("SeguroPlazo")]
        public decimal? SeguroPlazo { get; set; }
      
        
        [Column("IvaPlazo")]
        public decimal? IvaPlazo { get; set; }
      
        
        [Column("ManejoCuentaPlazo")]
        public decimal? ManejoCuentaPlazo { get; set; }
      
        
        [Column("PrestamoPersonal")]
        public bool? PrestamoPersonal { get; set; }
      
        
        [Column("SaldoComisionPlazo")]
        public decimal? SaldoComisionPlazo { get; set; }
      
        
        [Column("ProductoTotalPlazo")]
        public decimal? ProductoTotalPlazo { get; set; }
      
        
        [Column("saldoPlazo")]
        public decimal? saldoPlazo { get; set; }
      
        
        [Column("SaldoUltimoCorte")]
        public decimal? SaldoUltimoCorte { get; set; }
      
        
        [Column("AbonosPlazo")]
        public decimal? AbonosPlazo { get; set; }
      
        
        [Column("ImporteBonificacion")]
        public decimal? ImporteBonificacion { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("EmpresaId")]
        public int? EmpresaId { get; set; }
      
        
        [Column("DiaID")]
        public int? DiaID { get; set; }
      
        
        [Column("MesID")]
        public int? MesID { get; set; }
      
        
        [Column("AID")]
        public int? AID { get; set; }
      
        
        [Column("FechaHoraUltimoPago")]
        public DateTime? FechaHoraUltimoPago { get; set; }
      
        
        [Column("FechaLiquidacion")]
        public DateTime? FechaLiquidacion { get; set; }
      
        
        [Column("SegundosAnticipado")]
        public int? SegundosAnticipado { get; set; }


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
