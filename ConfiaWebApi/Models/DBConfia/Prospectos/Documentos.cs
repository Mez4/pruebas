using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospectos
{
    [TableName("Prospectos.Documentos")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class Documentos
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idPersona")]
        public int idPersona { get; set; }
      
        
        [Column("idTipoPersona")]
        public int idTipoPersona { get; set; }
      
        
        [Column("idTipoDocumento")]
        public int idTipoDocumento { get; set; }
      
        
        [Column("idMesaCredito")]
        public int idMesaCredito { get; set; }
      
        
        [Column("ruta")]
        public string ruta { get; set; }
      
        
        [Column("status")]
        public string status { get; set; }
      
        
        [Column("idDistribuidora")]
        public int? idDistribuidora { get; set; }
      
        
        [Column("motivo")]
        public string motivo { get; set; }


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
