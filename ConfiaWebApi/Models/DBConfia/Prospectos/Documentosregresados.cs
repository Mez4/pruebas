using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospectos
{
    [TableName("Prospectos.DocumentosRegresados")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class DocumentosRegresados
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idDocumento")]
        public int idDocumento { get; set; }
      
        
        [Column("observacion")]
        public string observacion { get; set; }
      
        
        [Column("fechaCreacion")]
        public DateTime? fechaCreacion { get; set; }


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
