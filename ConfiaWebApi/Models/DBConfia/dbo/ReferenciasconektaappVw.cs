using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.ReferenciasConektaApp_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ReferenciasConektaApp_VW
    {
              
        
        [Column("ReferenciaConektaID")]
        public int ReferenciaConektaID { get; set; }
      
        
        [Column("TelefonoReferencia")]
        public string TelefonoReferencia { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("Correo")]
        public string Correo { get; set; }
      
        
        [Column("Barcode_url")]
        public string Barcode_url { get; set; }
      
        
        [Column("Reference")]
        public string Reference { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime? FechaRegistro { get; set; }
      
        
        [Column("ComisionOxxo")]
        public decimal ComisionOxxo { get; set; }


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
