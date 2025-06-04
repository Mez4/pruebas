using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospectos
{
    [TableName("Prospectos.RelacionAutoMoto")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class RelacionAutoMoto
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idPersona")]
        public int idPersona { get; set; }
      
        
        [Column("idTipoPersona")]
        public int idTipoPersona { get; set; }
      
        
        [Column("modelo")]
        public string modelo { get; set; }
      
        
        [Column("marca")]
        public string marca { get; set; }
      
        
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
