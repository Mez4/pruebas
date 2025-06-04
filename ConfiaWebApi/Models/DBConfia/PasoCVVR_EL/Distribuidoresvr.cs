using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_EL
{
    [TableName("PasoCVVR_EL.DistribuidoresVR")]
    [ExplicitColumns]
    // No primary key detected
    public class DistribuidoresVR
    {
              
        
        [Column("Fecha")]
        public DateTime? Fecha { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("NombreCom")]
        public string NombreCom { get; set; }
      
        
        [Column("SucursalValeID")]
        public int? SucursalValeID { get; set; }
      
        
        [Column("SucursalVale")]
        public string SucursalVale { get; set; }
      
        
        [Column("NoCreditos")]
        public int? NoCreditos { get; set; }
      
        
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
