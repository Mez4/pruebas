using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.ColoresProducto_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ColoresProducto_VW
    {
              
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("NombreColor")]
        public string NombreColor { get; set; }
      
        
        [Column("ValorColor")]
        public Int64? ValorColor { get; set; }


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
