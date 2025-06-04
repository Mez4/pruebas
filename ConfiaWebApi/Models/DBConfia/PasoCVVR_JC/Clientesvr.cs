using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_JC
{
    [TableName("PasoCVVR_JC.ClientesVR")]
    [ExplicitColumns]
    // No primary key detected
    public class ClientesVR
    {
              
        
        [Column("FechaInsercion")]
        public DateTime? FechaInsercion { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("CveCli")]
        public string CveCli { get; set; }
      
        
        [Column("NombreCom")]
        public string NombreCom { get; set; }
      
        
        [Column("CURP")]
        public string CURP { get; set; }
      
        
        [Column("RFC")]
        public string RFC { get; set; }
      
        
        [Column("CveEnc")]
        public string CveEnc { get; set; }
      
        
        [Column("EstatusID")]
        public string EstatusID { get; set; }
      
        
        [Column("FecUltimoPago")]
        public DateTime? FecUltimoPago { get; set; }


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
