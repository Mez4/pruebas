using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.IDSOCIAS")]
    [ExplicitColumns]
    // No primary key detected
    public class IDSOCIAS
    {
              
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("DistribuidorID_CV")]
        public string DistribuidorID_CV { get; set; }
      
        
        [Column("SucursalID_VR")]
        public string SucursalID_VR { get; set; }
      
        
        [Column("SucursalID_CV")]
        public string SucursalID_CV { get; set; }
      
        
        [Column("DistribuidorID_VR")]
        public string DistribuidorID_VR { get; set; }
      
        
        [Column("Nota")]
        public string Nota { get; set; }


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
