using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.DocumentosAclaracion")]
    [ExplicitColumns]
    [PrimaryKey("DocumentoID")]
    public class DocumentosAclaracion
    {
              
        
        [Column("DocumentoID")]
        public int DocumentoID { get; set; }
      
        
        [Column("AclaracionID")]
        public int AclaracionID { get; set; }
      
        
        [Column("Ruta")]
        public string Ruta { get; set; }
      
        
        [Column("Firmado")]
        public bool? Firmado { get; set; }


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
