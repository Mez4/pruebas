using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.IdentificacionesTipos")]
    [ExplicitColumns]
    [PrimaryKey("identificacionTipoId")]
    public class IdentificacionesTipos
    {
              
        
        [Column("identificacionTipoId")]
        public int identificacionTipoId { get; set; }
      
        
        [Column("identificacionDesc")]
        public string identificacionDesc { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }


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
