using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_M
{
    [TableName("PasoCVVR_M.ClientesVR")]
    [ExplicitColumns]
    // No primary key detected
    public class ClientesVR
    {
              
        
        [Column("FechaPaso")]
        public DateTime? FechaPaso { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("CveCli")]
        public string CveCli { get; set; }
      
        
        [Column("NombreCom")]
        public string NombreCom { get; set; }
      
        
        [Column("EstatusID")]
        public string EstatusID { get; set; }
      
        
        [Column("FecUltimoPago")]
        public DateTime? FecUltimoPago { get; set; }
      
        
        [Column("FechaPrimerCanje")]
        public DateTime? FechaPrimerCanje { get; set; }
      
        
        [Column("FechaUltimoCanje")]
        public DateTime? FechaUltimoCanje { get; set; }


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
