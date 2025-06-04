using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.Zonales")]
    [ExplicitColumns]
    // No primary key detected
    public class Zonales
    {
              
        
        [Column("UsuarioID")]
        public int? UsuarioID { get; set; }
      
        
        [Column("ZonaID")]
        public int? ZonaID { get; set; }
      
        
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
