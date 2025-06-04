using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.DocumentosGenerales")]
    [ExplicitColumns]
    [PrimaryKey("ID")]
    public class DocumentosGenerales
    {
              
        
        [Column("ID")]
        public int ID { get; set; }
      
        
        [Column("NombreDocumento")]
        public string NombreDocumento { get; set; }
      
        
        [Column("Archivo")]
        public string Archivo { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }


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
