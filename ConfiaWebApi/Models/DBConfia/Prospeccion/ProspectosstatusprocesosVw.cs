using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.ProspectosStatusProcesos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ProspectosStatusProcesos_VW
    {
              
        
        [Column("StatusProcesoID")]
        public Int64 StatusProcesoID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("TipoPersonaID")]
        public int? TipoPersonaID { get; set; }
      
        
        [Column("Resultado")]
        public string Resultado { get; set; }
      
        
        [Column("Validado")]
        public bool? Validado { get; set; }
      
        
        [Column("CapturaObligatoria")]
        public bool? CapturaObligatoria { get; set; }
      
        
        [Column("DictamenObligatorio")]
        public bool? DictamenObligatorio { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }


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
