using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.DireccionesMigradas")]
    [ExplicitColumns]
    // No primary key detected
    public class DireccionesMigradas
    {
              
        
        [Column("IDDireccion")]
        public Int64 IDDireccion { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("IDExterno")]
        public string? IDExterno { get; set; }
      
        
        [Column("Ciudad")]
        public string Ciudad { get; set; }
      
        
        [Column("Direccion")]
        public string Direccion { get; set; }


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
