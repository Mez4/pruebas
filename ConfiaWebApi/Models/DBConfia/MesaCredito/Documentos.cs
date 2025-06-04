using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.Documentos")]
    [ExplicitColumns]
    // No primary key detected
    public class Documentos
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("documentoTipoId")]
        public int documentoTipoId { get; set; }
      
        
        [Column("carpetaId")]
        public int carpetaId { get; set; }
      
        
        [Column("url")]
        public string url { get; set; }
      
        
        [Column("fechaAlta")]
        public DateTime fechaAlta { get; set; }
      
        
        [Column("fechaMod")]
        public DateTime fechaMod { get; set; }
      
        
        [Column("fechaBaja")]
        public DateTime fechaBaja { get; set; }
      
        
        [Column("usuarioID")]
        public int usuarioID { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }


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
