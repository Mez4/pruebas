using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CuentasPBovedaDisponibles_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CuentasPBovedaDisponibles_VW
    {
              
        
        [Column("CuentaID")]
        public int CuentaID { get; set; }
      
        
        [Column("Cuenta")]
        public string Cuenta { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("TipoID")]
        public int TipoID { get; set; }


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
