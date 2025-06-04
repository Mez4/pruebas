using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.DocumentoConvenios")]
    [ExplicitColumns]
    [PrimaryKey("DocumentoConvenioID")]
    public class DocumentoConvenios
    {
              
        
        [Column("DocumentoConvenioID")]
        public Int64 DocumentoConvenioID { get; set; }
      
        
        [Column("UsuarioRegistroID")]
        public int UsuarioRegistroID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("ConvenioID")]
        public Int64 ConvenioID { get; set; }
      
        
        [Column("Ruta")]
        public string Ruta { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("UsuarioReemplazoID")]
        public int? UsuarioReemplazoID { get; set; }
      
        
        [Column("FechaReemplazo")]
        public DateTime? FechaReemplazo { get; set; }


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
