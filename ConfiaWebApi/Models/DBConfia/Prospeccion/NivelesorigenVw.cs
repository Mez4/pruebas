using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.NivelesOrigen_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class NivelesOrigen_VW
    {
              
        
        [Column("DistribuidorNivelIDOrigen")]
        public int DistribuidorNivelIDOrigen { get; set; }
      
        
        [Column("DistribuidorNivelOrigen")]
        public string DistribuidorNivelOrigen { get; set; }


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
