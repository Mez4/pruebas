using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.DistribuidoresMigrados")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DistribuidoresMigrados
    {
              
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("DistribuidorID_VR")]
        public string DistribuidorID_VR { get; set; }
      
        
        [Column("DistribuidorID_CV")]
        public Int64 DistribuidorID_CV { get; set; }
      
        
        [Column("SucursalID_VR")]
        public string SucursalID_VR { get; set; }
      
        
        [Column("SucursalID_CV")]
        public int SucursalID_CV { get; set; }


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
