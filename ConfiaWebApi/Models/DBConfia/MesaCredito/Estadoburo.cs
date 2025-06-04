using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.EstadoBuro")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class EstadoBuro
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idEstado")]
        public int idEstado { get; set; }
      
        
        [Column("abreviaturaBuro")]
        public string abreviaturaBuro { get; set; }


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
