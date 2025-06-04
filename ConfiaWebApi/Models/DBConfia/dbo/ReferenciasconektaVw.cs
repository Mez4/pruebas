using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.ReferenciasConekta_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ReferenciasConekta_VW
    {
              
        
        [Column("ReferenciaConektaID")]
        public int ReferenciaConektaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("Telefono")]
        public string Telefono { get; set; }
      
        
        [Column("Correo")]
        public string Correo { get; set; }
      
        
        [Column("Barcode_url")]
        public string Barcode_url { get; set; }
      
        
        [Column("Reference")]
        public string Reference { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime? FechaRegistro { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }


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
