using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.STP
{
    [TableName("STP.CatalogoPlazas")]
    [ExplicitColumns]
    // No primary key detected
    public class CatalogoPlazas
    {
              
        
        [Column("PlazaID")]
        public int PlazaID { get; set; }
      
        
        [Column("NumeroPlaza")]
        public string NumeroPlaza { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }


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
