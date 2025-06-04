using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Reestructura
{
    [TableName("Reestructura.QuitaPorcentajes")]
    [ExplicitColumns]
    // No primary key detected
    public class QuitaPorcentajes
    {
              
        
        [Column("QuitaID")]
        public int QuitaID { get; set; }
      
        
        [Column("PagosNombre")]
        public string PagosNombre { get; set; }
      
        
        [Column("PorcientoQuita")]
        public int? PorcientoQuita { get; set; }
      
        
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
