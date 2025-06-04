using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_C
{
    [TableName("PasoCVVR_C.Distribuidores")]
    [ExplicitColumns]
    // No primary key detected
    public class Distribuidores
    {
              
        
        [Column("Fecha")]
        public DateTime? Fecha { get; set; }
      
        
        [Column("Distribuidorid")]
        public int? Distribuidorid { get; set; }
      
        
        [Column("nombreCom")]
        public string nombreCom { get; set; }
      
        
        [Column("SucursalValeID")]
        public int? SucursalValeID { get; set; }
      
        
        [Column("SucursalVale")]
        public string SucursalVale { get; set; }
      
        
        [Column("Nocreditos")]
        public int? Nocreditos { get; set; }
      
        
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
