using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Pagos
{
    [TableName("Pagos.rpmmxSTPCredenciales")]
    [ExplicitColumns]
    // No primary key detected
    public class rpmmxSTPCredenciales
    {
              
        
        [Column("id_prestador")]
        public string id_prestador { get; set; }
      
        
        [Column("Prestador")]
        public string Prestador { get; set; }
      
        
        [Column("usuario")]
        public string usuario { get; set; }
      
        
        [Column("contrasena")]
        public string contrasena { get; set; }


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
