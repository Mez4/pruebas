using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.TipoDocumento")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class TipoDocumento
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("clave")]
        public string clave { get; set; }
      
        
        [Column("descripcion")]
        public string descripcion { get; set; }
      
        
        [Column("status")]
        public string status { get; set; }


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
