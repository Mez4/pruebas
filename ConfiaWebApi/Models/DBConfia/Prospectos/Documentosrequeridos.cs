using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospectos
{
    [TableName("Prospectos.DocumentosRequeridos")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class DocumentosRequeridos
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("claveTipoDocumento")]
        public string claveTipoDocumento { get; set; }
      
        
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
