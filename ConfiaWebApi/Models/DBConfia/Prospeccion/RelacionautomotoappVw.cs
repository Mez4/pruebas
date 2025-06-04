using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.RelacionAutoMotoApp_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class RelacionAutoMotoApp_VW
    {
              
        
        [Column("RelacionAutoMotoID")]
        public Int64 RelacionAutoMotoID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("TipoPersonaID")]
        public int TipoPersonaID { get; set; }
      
        
        [Column("Modelo")]
        public string Modelo { get; set; }
      
        
        [Column("Marca")]
        public string Marca { get; set; }
      
        
        [Column("Status")]
        public string Status { get; set; }


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
