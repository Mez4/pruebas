using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospectos
{
    [TableName("Prospectos.TipoPersona")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class TipoPersona
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("clave")]
        public string clave { get; set; }
      
        
        [Column("descripcion")]
        public string descripcion { get; set; }


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
