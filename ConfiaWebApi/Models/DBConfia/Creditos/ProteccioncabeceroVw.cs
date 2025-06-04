using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ProteccionCabecero_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ProteccionCabecero_VW
    {
              
        
        [Column("ProteccionCabeceroID")]
        public int ProteccionCabeceroID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("NombreCaptura")]
        public string NombreCaptura { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }
      
        
        [Column("NombreModifica")]
        public string NombreModifica { get; set; }
      
        
        [Column("FechaModifica")]
        public DateTime? FechaModifica { get; set; }


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
