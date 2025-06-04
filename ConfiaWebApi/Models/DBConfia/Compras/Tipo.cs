using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.Tipo")]
    [ExplicitColumns]
    [PrimaryKey("TipoID")]
    public class Tipo
    {
              
        
        [Column("TipoID")]
        public int TipoID { get; set; }
      
        
        [Column("Tipos")]
        public string Tipos { get; set; }


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
