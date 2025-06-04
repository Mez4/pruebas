using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.PlazosReestructura")]
    [ExplicitColumns]
    [PrimaryKey("PlazosReestructuraID")]
    public class PlazosReestructura
    {
              
        
        [Column("PlazosReestructuraID")]
        public int PlazosReestructuraID { get; set; }
      
        
        [Column("Plazo")]
        public int Plazo { get; set; }
      
        
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
