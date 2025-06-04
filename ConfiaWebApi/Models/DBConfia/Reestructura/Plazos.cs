using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Reestructura
{
    [TableName("Reestructura.Plazos")]
    [ExplicitColumns]
    // No primary key detected
    public class Plazos
    {
              
        
        [Column("PlazoID")]
        public int PlazoID { get; set; }
      
        
        [Column("Quincenas")]
        public int? Quincenas { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }


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
