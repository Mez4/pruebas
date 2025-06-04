using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.tmp_paso_pagos")]
    [ExplicitColumns]
    // No primary key detected
    public class tmp_paso_pagos
    {
              
        
        [Column("creditoid")]
        public Int64? creditoid { get; set; }
      
        
        [Column("plazo")]
        public int? plazo { get; set; }
      
        
        [Column("abono")]
        public decimal? abono { get; set; }
      
        
        [Column("fecha_pago")]
        public DateTime? fecha_pago { get; set; }
      
        
        [Column("fechora_cap")]
        public DateTime? fechora_cap { get; set; }


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
