using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_M
{
    [TableName("PasoCVVR_M.SociasVR")]
    [ExplicitColumns]
    // No primary key detected
    public class SociasVR
    {
              
        
        [Column("FechaPaso")]
        public DateTime? FechaPaso { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("NombreCom")]
        public string NombreCom { get; set; }
      
        
        [Column("SucursalValeID")]
        public int? SucursalValeID { get; set; }
      
        
        [Column("SucursalVale")]
        public string SucursalVale { get; set; }
      
        
        [Column("Creditos")]
        public int? Creditos { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("FechaPrimerCanje")]
        public DateTime? FechaPrimerCanje { get; set; }
      
        
        [Column("FechaUltimoCanje")]
        public DateTime? FechaUltimoCanje { get; set; }
      
        
        [Column("EstatusID")]
        public string EstatusID { get; set; }


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
