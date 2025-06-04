using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.AbonosGestores_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class AbonosGestores_VW
    {
              
        
        [Column("FechaCorte")]
        public string FechaCorte { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("UltRelacionImporte")]
        public decimal? UltRelacionImporte { get; set; }
      
        
        [Column("Fecha")]
        public string Fecha { get; set; }


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
