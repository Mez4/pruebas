using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.AnalistasSinSucursal_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class AnalistasSinSucursal_VW
    {
              
        
        [Column("AnalistaID")]
        public Int64 AnalistaID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }


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
