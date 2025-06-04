using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.AppVale
{
    [TableName("AppVale.AppRelacionCortes_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class AppRelacionCortes_VW
    {
              
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int? DistribuidorNivelID { get; set; }
      
        
        [Column("fechaCorte")]
        public DateTime? fechaCorte { get; set; }
      
        
        [Column("fechaRelacion")]
        public DateTime fechaRelacion { get; set; }
      
        
        [Column("limiteCredito")]
        public decimal? limiteCredito { get; set; }
      
        
        [Column("saldoAbonado")]
        public decimal? saldoAbonado { get; set; }
      
        
        [Column("capital")]
        public decimal? capital { get; set; }
      
        
        [Column("saldoDisponible")]
        public decimal? saldoDisponible { get; set; }
      
        
        [Column("interes")]
        public decimal? interes { get; set; }
      
        
        [Column("seguro")]
        public decimal? seguro { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("importePago")]
        public decimal? importePago { get; set; }
      
        
        [Column("saldoAtrasado")]
        public decimal? saldoAtrasado { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        
        [Column("saldoColocado")]
        public decimal? saldoColocado { get; set; }
      
        
        [Column("ManejoCuentaPlazo")]
        public decimal? ManejoCuentaPlazo { get; set; }
      
        
        [Column("CargoPlazo")]
        public decimal? CargoPlazo { get; set; }
      
        
        [Column("IvaPlazo")]
        public decimal? IvaPlazo { get; set; }


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
