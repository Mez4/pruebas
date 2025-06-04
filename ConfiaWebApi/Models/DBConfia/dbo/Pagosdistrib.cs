using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.pagosDistrib")]
    [ExplicitColumns]
    // No primary key detected
    public class pagosDistrib
    {
              
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("Monto")]
        public decimal? Monto { get; set; }
      
        
        [Column("FechaPago")]
        public DateTime? FechaPago { get; set; }
      
        
        [Column("Aplicado")]
        public bool? Aplicado { get; set; }


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
