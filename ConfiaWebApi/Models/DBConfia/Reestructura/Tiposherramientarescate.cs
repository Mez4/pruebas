using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Reestructura
{
    [TableName("Reestructura.TiposHerramientaRescate")]
    [ExplicitColumns]
    [PrimaryKey("TipoHerramientaID")]
    public class TiposHerramientaRescate
    {
              
        
        [Column("TipoHerramientaID")]
        public int TipoHerramientaID { get; set; }
      
        
        [Column("NombreTipoHerramienta")]
        public string NombreTipoHerramienta { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }


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
