using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.MsjMotivosExpedientes")]
    [ExplicitColumns]
    [PrimaryKey("MsjMotivoExpedienteID")]
    public class MsjMotivosExpedientes
    {
              
        
        [Column("MsjMotivoExpedienteID")]
        public int MsjMotivoExpedienteID { get; set; }
      
        
        [Column("Mensaje")]
        public string Mensaje { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("MsjError")]
        public bool MsjError { get; set; }
      
        
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
