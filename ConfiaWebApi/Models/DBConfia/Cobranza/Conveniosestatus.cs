using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.ConveniosEstatus")]
    [ExplicitColumns]
    [PrimaryKey("EstatusId")]
    public class ConveniosEstatus
    {
              
        
        [Column("EstatusId")]
        public int EstatusId { get; set; }
      
        
        [Column("EstatusDesc")]
        public string EstatusDesc { get; set; }
      
        
        [Column("Color")]
        public string Color { get; set; }


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
