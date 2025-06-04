using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.Talla")]
    [ExplicitColumns]
    [PrimaryKey("TallaID")]
    public class Talla
    {
              
        
        [Column("TallaID")]
        public int TallaID { get; set; }
      
        
        [Column("Tallas")]
        public string Tallas { get; set; }


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
